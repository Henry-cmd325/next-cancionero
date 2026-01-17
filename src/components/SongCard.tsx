'use client';

import { deleteSong } from '@/app/actions';
import { useTransition } from 'react';
import Link from 'next/link';

type SongProps = {
    id: string;
    title: string;
    artist: string;
    content: string;
    songKey?: string | null;
};

export function SongCard({ id, title, artist, content, songKey }: SongProps) {
    const [isPending, startTransition] = useTransition();

    return (
        <Link
            href={`/songs/${id}`}
            className="group bg-[#151A23] rounded-xl border border-[#1E293B] hover:border-blue-500/50 p-5 transition-all hover:shadow-lg hover:shadow-blue-900/10 flex flex-col h-full cursor-pointer"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{title}</h3>
                    <p className="text-slate-400 text-sm">{artist}</p>
                </div>
                {songKey && (
                    <span className="bg-[#1E293B] text-slate-300 border border-slate-700 text-xs font-mono font-bold px-2.5 py-1 rounded-md">
                        {songKey}
                    </span>
                )}
            </div>

            <div className="relative flex-1 mb-4 bg-[#0B0E14] rounded-lg p-3 border border-[#1E293B] overflow-hidden">
                <pre className="font-mono text-xs text-slate-400 leading-relaxed whitespace-pre-wrap line-clamp-6">
                    {content}
                </pre>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0B0E14] to-transparent" />
            </div>

            <div className="flex justify-end gap-2 pt-2 text-sm font-medium">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        startTransition(() => deleteSong(id));
                    }}
                    disabled={isPending}
                    className="px-3 py-1.5 rounded-md text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors disabled:opacity-50"
                >
                    {isPending ? '...' : 'Borrar'}
                </button>
            </div>
        </Link>
    );
}
