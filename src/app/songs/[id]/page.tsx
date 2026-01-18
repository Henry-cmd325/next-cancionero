import { prisma } from '@/lib/prisma';
import { SongView } from '@/app/songs/components/SongView';
import { notFound } from 'next/navigation';

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function SongPage({ params }: PageProps) {
    const { id } = await params;

    const song = await prisma.song.findUnique({
        where: { id },
    });

    if (!song) {
        notFound();
    }

    return <SongView song={song} />;
}
