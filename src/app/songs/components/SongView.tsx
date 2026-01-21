'use client';

import { createSong, updateSong } from '@/app/songs/actions';
import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChordSidebar } from './ChordSidebar';
import { LyricLine } from './LyricLine';
import {
    Chord,
    deserializeContent,
    serializeContent,
    generateChordId
} from '../utils/chordUtils';

type Song = {
    id?: string;
    title: string;
    artist: string;
    content: string;
    key: string | null;
};

type SongViewProps = {
    song?: Song;
    isInitialEdit?: boolean;
};

export function SongView({ song, isInitialEdit = false }: SongViewProps) {
    const router = useRouter();
    const [mode, setMode] = useState<'view' | 'edit'>(isInitialEdit ? 'edit' : 'view');
    const [editorMode, setEditorMode] = useState<'text' | 'chords'>('text');

    // Deserialize content (handle empty content for new songs)
    const initialContent = deserializeContent(song?.content || '');
    const [lyrics, setLyrics] = useState(initialContent.lyrics);
    const [chords, setChords] = useState<Chord[]>(initialContent.chords);

    const [formData, setFormData] = useState({
        title: song?.title || '',
        artist: song?.artist || '',
        key: song?.key || '',
    });

    const [draggedChord, setDraggedChord] = useState<string | null>(null);

    const handleSave = async () => {
        if (!formData.title || !formData.artist || !lyrics) {
            console.error('Por favor completa los campos requeridos (Título, Artista y Letra)');
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('artist', formData.artist);
        data.append('content', serializeContent(lyrics, chords));
        data.append('key', formData.key);

        try {
            if (song?.id) {
                // Edit existing song
                await updateSong(song.id, data);
                setMode('view');
            } else {
                // Create new song
                const newSong = await createSong(data);
                router.push(`/songs/${newSong.id}`);
            }
        } catch (error) {
            console.error('Error al guardar la canción:', error);
            alert('Ocurrió un error al guardar la canción. Por favor, inténtalo de nuevo.');
        }
    };

    const handleChordDrag = (chordName: string) => {
        setDraggedChord(chordName);
    };

    const handleDeleteChord = (id: string) => {
        setChords(chords.filter(chord => chord.id !== id));
    };

    const handleDropChord = (lineIndex: number, position: number, chordName: string) => {
        const newChord: Chord = {
            id: generateChordId(),
            name: chordName,
            line: lineIndex,
            position
        };
        setChords(prevChords => [...prevChords, newChord]);
    }

    // Render content based on mode
    const renderContent = () => {
        if (mode === 'view') {
            const lines = lyrics.split('\n');
            return (
                <div className="relative min-h-[450px] font-mono text-sm leading-relaxed space-y-1">
                    {lines.map((line, i) => (
                        <LyricLine
                            key={i}
                            lineIndex={i}
                            text={line}
                            chords={chords}
                            onDeleteChord={handleDeleteChord}
                            onDropChord={handleDropChord}
                            isChordMode={false}
                            draggedChord={null}
                        />
                    ))}
                </div>
            );
        }

        if (editorMode === 'text') {
            return (
                <textarea
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    className="w-full h-full min-h-[450px] bg-transparent text-slate-300 font-mono text-sm leading-relaxed outline-none resize-none placeholder:text-slate-700"
                    placeholder="Escribe la letra aquí..."
                />
            );
        }

        const lines = lyrics.trim().split('\n');

        return (
            <div className="relative min-h-[450px] font-mono text-sm leading-relaxed space-y-1">
                {lines.length === 0 && (
                    <p className="text-slate-500">Debes escribir al menos una línea de letra para poder agregar acordes.</p>
                )}

                {lines.map((line, i) => (
                    <LyricLine
                        key={i}
                        lineIndex={i}
                        text={line}
                        chords={chords}
                        onDeleteChord={handleDeleteChord}
                        onDropChord={handleDropChord}
                        isChordMode={true}
                        draggedChord={draggedChord}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="flex h-full gap-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between pb-4 border-b border-[#1E293B] mb-6">
                        <div className="flex-1">
                            {mode === 'edit' ? (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Título de la canción"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="text-2xl font-bold bg-transparent border-none outline-none text-white w-full placeholder:text-slate-600"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Artista"
                                        value={formData.artist}
                                        onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                                        className="text-sm bg-transparent border-none outline-none text-slate-400 mt-1 block w-full placeholder:text-slate-700"
                                    />
                                </>
                            ) : (
                                <>
                                    <h1 className="text-2xl font-bold text-white">{formData.title}</h1>
                                    <p className="text-sm text-slate-400 mt-1">{formData.artist}</p>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-3 ml-4">
                            {mode === 'edit' ? (
                                <input
                                    type="text"
                                    value={formData.key}
                                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                                    placeholder="Tono"
                                    className="w-16 text-center bg-[#1E293B] text-slate-300 border border-slate-700 text-xs font-mono font-bold px-2 py-1 rounded-md outline-none"
                                />
                            ) : (
                                formData.key && (
                                    <span className="bg-[#1E293B] text-slate-300 border border-slate-700 text-xs font-mono font-bold px-2.5 py-1 rounded-md">
                                        {formData.key}
                                    </span>
                                )
                            )}

                            <div className="flex items-center gap-3">
                                {mode === 'edit' && (
                                    <div className="flex bg-[#1E293B] rounded-lg p-0.5">
                                        <button
                                            onClick={() => setEditorMode('text')}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${editorMode === 'text' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                                                }`}
                                        >
                                            Modo Texto
                                        </button>
                                        <button
                                            onClick={() => setEditorMode('chords')}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${editorMode === 'chords' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                                                }`}
                                        >
                                            Modo Acordes
                                        </button>
                                    </div>
                                )}

                                <div className="flex bg-[#1E293B] rounded-lg p-0.5">
                                    {song?.id ? (
                                        <>
                                            <button
                                                onClick={() => setMode('view')}
                                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'view' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                onClick={() => mode === 'view' ? setMode('edit') : handleSave()}
                                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'edit' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                {mode === 'edit' ? 'Guardar' : 'Editar'}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleSave}
                                            className="px-6 py-1.5 rounded-md text-sm font-bold transition-all bg-blue-600 text-white shadow-sm"
                                        >
                                            Crear
                                        </button>
                                    )}
                                </div>

                                <Link
                                    href="/"
                                    className="text-slate-400 hover:text-white hover:bg-[#1E293B] w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                                    title="Volver"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#151A23] rounded-xl border border-[#1E293B] p-8 min-h-[500px]">
                        {renderContent()}
                    </div>
                </div>
            </div>

            {mode === 'edit' && editorMode === 'chords' && (
                <ChordSidebar onChordDrag={handleChordDrag} />
            )}
        </div>
    );
}
