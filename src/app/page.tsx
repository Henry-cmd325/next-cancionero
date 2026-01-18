import { prisma } from '@/lib/prisma';
import { SongCard } from '@/app/songs/components/SongCard';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancionero - Inicio',
};

export default async function Home() {
  const songs = await prisma.song.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-[#1E293B] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Mis Canciones</h1>
          <p className="text-slate-400 mt-2 text-sm">Gestiona y organiza tu setlist.</p>
        </div>
        <Link
          href="/songs/add"
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg transition-all font-medium text-sm shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          <span>➕</span> <span className="hidden sm:inline">Nueva Canción</span>
        </Link>
      </div>

      {songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#151A23] rounded-2xl border border-dashed border-[#1E293B]">
          <div className="w-16 h-16 bg-[#1E293B] rounded-full flex items-center justify-center mb-4 text-2xl">
            🎸
          </div>
          <p className="text-slate-300 font-medium">Tu repertorio está vacío</p>
          <p className="text-slate-500 text-sm mt-1">Comienza agregando tu primera canción.</p>
          <Link href="/songs/add" className="mt-6 text-blue-400 hover:text-blue-300 font-medium text-sm hover:underline">
            Crear canción ahora &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              id={song.id}
              title={song.title}
              artist={song.artist}
              content={song.content}
              songKey={song.key}
            />
          ))}
        </div>
      )}
    </div>
  );
}
