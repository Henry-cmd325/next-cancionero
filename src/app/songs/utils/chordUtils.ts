// Chord data types and utilities

export type Chord = {
    id: string;
    name: string;
    line: number;
    position: number;
};

export type SongContent = {
    lyrics: string;
    chords: Chord[];
};

/**
 * Serialize song content for database storage
 */
export function serializeContent(lyrics: string, chords: Chord[]): string {
    return JSON.stringify({ lyrics, chords });
}

/**
 * Deserialize song content from database
 * Handles backward compatibility with plain text content
 */
export function deserializeContent(content: string): SongContent {
    try {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object' && 'lyrics' in parsed) {
            return {
                lyrics: parsed.lyrics || '',
                chords: parsed.chords || []
            };
        }
    } catch {
        // Not JSON, treat as plain text
    }

    // Backward compatibility: treat as plain text
    return {
        lyrics: content,
        chords: []
    };
}

/**
 * Generate unique ID for chords
 */
export function generateChordId(): string {
    return `chord_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Calculate CSS position from chord data
 */
export function getChordPosition(chord: Chord): { top: number; left: number } {
    const lineHeight = 24; // matches leading-relaxed
    const charWidth = 8.4; // approximate monospace char width

    return {
        top: chord.line * lineHeight,
        left: chord.position * charWidth
    };
}

/**
 * Calculate chord data from drop event
 */
export function calculateChordFromDrop(
    e: React.DragEvent,
    containerRect: DOMRect
): { line: number; position: number } {
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;

    const lineHeight = 24;
    const charWidth = 8.4;

    return {
        line: Math.max(0, Math.floor(y / lineHeight)),
        position: Math.max(0, Math.round(x / charWidth))
    };
}
