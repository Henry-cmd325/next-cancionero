'use client';

import { useState } from 'react';
import { Chord } from '../utils/chordUtils';

type ChordBadgeProps = {
    chord: Chord;
    onDelete: (id: string) => void;
    isDraggable?: boolean;
    className?: string;
};

export function ChordBadge({ chord, onDelete, isDraggable = true, className = '' }: ChordBadgeProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (e: React.DragEvent) => {
        if (!isDraggable) return;
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('chordId', chord.id);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    return (
        <div
            draggable={isDraggable}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                inline-flex items-center gap-1
                bg-blue-600 text-white text-[10px] font-bold
                px-1.5 py-0.5 rounded
                shadow-sm
                transition-all
                select-none
                ${isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
                ${isDragging ? 'opacity-50' : 'opacity-100'}
                ${isHovered ? 'shadow-md scale-105' : ''}
                ${className}
            `}
            style={{
                zIndex: 10
            }}
        >
            <span>{chord.name}</span>
            {isHovered && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(chord.id);
                    }}
                    className="ml-0.5 text-white/80 hover:text-white transition-colors"
                    title="Eliminar acorde"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
