'use client';

import { useState } from 'react';

type ChordDiagramData = {
    name: string;
    positions: number[]; // Fret positions for 6 strings (E A D G B e), -1 = muted, 0 = open
    fingers: number[];   // Finger numbers (0 = open, 1-4 = fingers)
    baseFret?: number;   // Starting fret for barre chords
};

const COMMON_CHORDS: ChordDiagramData[] = [
    { name: 'C', positions: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
    { name: 'D', positions: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
    { name: 'E', positions: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
    { name: 'F', positions: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], baseFret: 1 },
    { name: 'G', positions: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4] },
    { name: 'A', positions: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
    { name: 'B', positions: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 3, 3, 3, 1], baseFret: 2 },
    { name: 'Am', positions: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
    { name: 'Dm', positions: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
    { name: 'Em', positions: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
    { name: 'Fm', positions: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], baseFret: 1 },
    { name: 'Gm', positions: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], baseFret: 3 },
    { name: 'C7', positions: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0] },
    { name: 'D7', positions: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3] },
    { name: 'E7', positions: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0] },
    { name: 'G7', positions: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1] },
    { name: 'A7', positions: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0] },
];

type ChordItemProps = {
    chord: Chord;
    onDragStart: (chordName: string) => void;
};

function ChordItem({ chord, onDragStart }: ChordItemProps) {
    return (
        <div
            draggable
            onDragStart={() => onDragStart(chord.name)}
            className="bg-[#1E293B] border border-slate-700 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-blue-500 hover:bg-[#252F3F] transition-all"
        >
            <div className="text-center mb-2">
                <span className="text-white font-bold text-lg">{chord.name}</span>
            </div>
            <ChordDiagram chord={chord} />
        </div>
    );
}

type ChordDiagramProps = {
    chord: Chord;
};

function ChordDiagram({ chord }: ChordDiagramProps) {
    const strings = 6;
    const frets = 4;
    const stringSpacing = 20;
    const fretSpacing = 18;
    const width = (strings - 1) * stringSpacing + 20;
    const height = frets * fretSpacing + 30;

    return (
        <svg width={width} height={height} className="mx-auto">
            {/* Strings (vertical lines) */}
            {Array.from({ length: strings }).map((_, i) => (
                <line
                    key={`string-${i}`}
                    x1={10 + i * stringSpacing}
                    y1={20}
                    x2={10 + i * stringSpacing}
                    y2={20 + frets * fretSpacing}
                    stroke="#64748b"
                    strokeWidth="1"
                />
            ))}

            {/* Frets (horizontal lines) */}
            {Array.from({ length: frets + 1 }).map((_, i) => (
                <line
                    key={`fret-${i}`}
                    x1={10}
                    y1={20 + i * fretSpacing}
                    x2={10 + (strings - 1) * stringSpacing}
                    y2={20 + i * fretSpacing}
                    stroke="#64748b"
                    strokeWidth={i === 0 ? "3" : "1"}
                />
            ))}

            {/* Finger positions */}
            {chord.positions.map((pos, stringIndex) => {
                if (pos === -1) {
                    // Muted string (X)
                    return (
                        <text
                            key={`pos-${stringIndex}`}
                            x={10 + stringIndex * stringSpacing}
                            y={12}
                            textAnchor="middle"
                            fill="#ef4444"
                            fontSize="12"
                            fontWeight="bold"
                        >
                            ×
                        </text>
                    );
                } else if (pos === 0) {
                    // Open string (O)
                    return (
                        <circle
                            key={`pos-${stringIndex}`}
                            cx={10 + stringIndex * stringSpacing}
                            cy={10}
                            r={4}
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="2"
                        />
                    );
                } else {
                    // Fretted note
                    return (
                        <circle
                            key={`pos-${stringIndex}`}
                            cx={10 + stringIndex * stringSpacing}
                            cy={20 + (pos - 0.5) * fretSpacing}
                            r={5}
                            fill="#3b82f6"
                        />
                    );
                }
            })}

            {/* Base fret indicator */}
            {chord.baseFret && chord.baseFret > 1 && (
                <text
                    x={5}
                    y={25}
                    fill="#94a3b8"
                    fontSize="10"
                    fontWeight="bold"
                >
                    {chord.baseFret}
                </text>
            )}
        </svg>
    );
}

type ChordSidebarProps = {
    onChordDrag: (chordName: string) => void;
};

export function ChordSidebar({ onChordDrag }: ChordSidebarProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredChords = COMMON_CHORDS.filter(chord =>
        chord.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-80 bg-[#0F1419] border-l border-[#1E293B] flex flex-col h-full">
            <div className="p-4 border-b border-[#1E293B]">
                <h2 className="text-white font-bold text-lg mb-3">Acordes</h2>
                <input
                    type="text"
                    placeholder="Buscar acorde..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#1E293B] text-slate-300 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="grid grid-cols-2 gap-3 pb-8">
                    {filteredChords.map((chord) => (
                        <ChordItem
                            key={chord.name}
                            chord={chord}
                            onDragStart={onChordDrag}
                        />
                    ))}
                </div>

                {filteredChords.length === 0 && (
                    <p className="text-slate-500 text-center mt-8 text-sm">
                        No se encontraron acordes
                    </p>
                )}
            </div>
        </div>
    );
}
