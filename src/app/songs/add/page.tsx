'use client';

import { SongView } from '@/app/songs/components/SongView';

export default function AddSongPage() {
    return (
        <SongView isInitialEdit={true} />
    );
}
