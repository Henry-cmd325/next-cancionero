'use client';

import { updateSong } from '@/app/actions';
import { useState } from 'react';
import Link from 'next/link';

type Song = {
    id: string;
    title: string;
    artist: string;
    content: string;
    key: string | null;
};

type SongViewProps = {
    song: Song;
};

export function SongView({ song }: SongViewProps) {
    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const [formData, setFormData] = useState({
        title: song.title,
        artist: song.artist,
        content: song.content,
        key: song.key || '',
    });

    const handleSave = async () => {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('artist', formData.artist);
        data.append('content', formData.content);
        data.append('key', formData.key);

        await updateSong(song.id, data);
        setMode('view');
    };

    // Highlight chords in view mode
    const renderContent = () => {
        if (mode === 'edit') {
            return (
                <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full h-full min-h-[450px] bg-transparent text-slate-300 font-mono text-sm leading-relaxed outline-none resize-none"
                />
            );
        }

        // Simple chord highlighting: words that are common chord patterns
        const lines = formData.content.split('\n');
        return (
            <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {lines.map((line, i) => {
                    // Detect if line is likely chords (short words, musical notation)
                    const isChordLine = /^[\sA-G#bm0-9/]+$/.test(line) && line.trim().length > 0;

                    if (isChordLine) {
                        return (
                            <div key={i} className="text-blue-400 font-bold">
                                {line}
                            </div>
                        );
                    }

                    return (
                        <div key={i} className="text-slate-300">
                            {line}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1E293B] mb-6">
                <div className="flex-1">
                    {mode === 'edit' ? (
                        <>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="text-2xl font-bold bg-transparent border-none outline-none text-white w-full"
                            />
                            <input
                                type="text"
                                value={formData.artist}
                                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                                className="text-sm bg-transparent border-none outline-none text-slate-400 mt-1 block w-full"
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
                        {/* Toggle Ver/Editar */}
                        <div className="flex bg-[#1E293B] rounded-lg p-0.5">
                            <button
                                onClick={() => setMode('view')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'view'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Ver
                            </button>
                            <button
                                onClick={() => mode === 'view' ? setMode('edit') : handleSave()}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'edit'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {mode === 'edit' ? 'Guardar' : 'Editar'}
                            </button>
                        </div>

                        {/* Arrow back button */}
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

            {/* Content Area */}
            <div className="bg-[#151A23] rounded-xl border border-[#1E293B] p-8 min-h-[500px]">
                {renderContent()}
            </div>
        </div>
    );
}
