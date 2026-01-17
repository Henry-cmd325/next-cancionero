import { createSong } from '@/app/actions';
import { redirect } from 'next/navigation';

export default function AddSongPage() {
    async function handleCreate(formData: FormData) {
        'use server';
        const title = formData.get('title') as string;
        const artist = formData.get('artist') as string;
        const content = formData.get('content') as string;
        const key = formData.get('key') as string;

        if (!title || !artist || !content) {
            throw new Error('Missing required fields');
        }

        const song = await createSong(formData);
        redirect(`/songs/${song.id}`);
    }

    return (
        <div className="max-w-4xl mx-auto">
            <form action={handleCreate} className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
                    <div>
                        <input
                            type="text"
                            name="title"
                            placeholder="Título de la canción"
                            required
                            className="text-2xl font-bold bg-transparent border-none outline-none text-white placeholder:text-slate-600"
                        />
                        <input
                            type="text"
                            name="artist"
                            placeholder="Artista"
                            required
                            className="text-sm bg-transparent border-none outline-none text-slate-400 placeholder:text-slate-700 mt-1 block"
                        />
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="key"
                            placeholder="Tono"
                            className="w-16 text-center bg-[#1E293B] text-slate-300 border border-slate-700 text-xs font-mono font-bold px-2 py-1 rounded-md outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Crear
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-[#151A23] rounded-xl border border-[#1E293B] p-8 min-h-[500px]">
                    <textarea
                        name="content"
                        required
                        placeholder="Escribe la letra y acordes aquí..."
                        className="w-full h-full min-h-[450px] bg-transparent text-slate-300 font-mono text-sm leading-relaxed outline-none resize-none placeholder:text-slate-700"
                    />
                </div>
            </form>
        </div>
    );
}
