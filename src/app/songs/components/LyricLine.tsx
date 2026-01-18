'use client';

import { useState } from 'react';
import { Chord } from '../utils/chordUtils';
import { ChordBadge } from './ChordBadge';

type LyricLineProps = {
    lineIndex: number;
    text: string;
    chords: Chord[];
    onDeleteChord: (id: string) => void;
    onMoveChord?: (id: string, line: number, position: number) => void;
    onDropChord: (lineIndex: number, position: number, chordName: string) => void;
    isChordMode: boolean;
    draggedChord: string | null;
};

export function LyricLine({
    lineIndex,
    text,
    chords,
    onDeleteChord,
    onMoveChord,
    onDropChord,
    isChordMode,
    draggedChord
}: LyricLineProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Filter chords for this specific line
    const lineChords = chords.filter(chord => chord.line === lineIndex);

    const handleDragOver = (e: React.DragEvent) => {
        if (!isChordMode || !draggedChord) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent) => {
        if (!isChordMode || !draggedChord) return;
        e.preventDefault();

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const charWidth = 8.4;
        const position = Math.max(0, Math.round(x / charWidth));

        onDropChord(lineIndex, position, draggedChord);
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`
                relative py-1 px-3 -mx-3 rounded-md transition-all
                ${isChordMode && isHovered ? 'border-2 border-dashed border-slate-600 bg-slate-800/20' : 'border-2 border-transparent'}
            `}
        >
            {/* Chord row */}
            <div className="relative h-6 mb-1">
                {lineChords.map((chord) => (
                    <div
                        key={chord.id}
                        className="absolute"
                        style={{
                            left: `${chord.position * 8.4}px`,
                            top: 0
                        }}
                    >
                        <ChordBadge
                            chord={chord}
                            onDelete={onDeleteChord}
                            onMove={onMoveChord}
                            isDraggable={false}
                        />
                    </div>
                ))}
            </div>

            {/* Lyric text */}
            <div className="font-mono text-sm leading-relaxed text-slate-300 whitespace-pre">
                {text || '\u00A0'}
            </div>
        </div>
    );
}
