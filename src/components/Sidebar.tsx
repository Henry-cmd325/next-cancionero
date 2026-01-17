import Link from 'next/link';

export function Sidebar() {
    return (
        <div className="h-screen w-64 bg-[#0B0E14] border-r border-[#1E293B] flex flex-col p-4 fixed top-0 left-0 z-10">
            <h1 className="text-xl font-bold text-white mb-8 px-4 flex items-center gap-2">
                🎸 Cancionero
            </h1>

            <nav className="flex-1 space-y-1">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#151A23] transition-all font-medium text-sm"
                >
                    <span>🎵</span> Mis Canciones
                </Link>
                <Link
                    href="/songs/add"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#151A23] transition-all font-medium text-sm"
                >
                    <span>➕</span> Nueva Canción
                </Link>
            </nav>

            <div className="mt-auto pt-4 border-t border-[#1E293B] px-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                        HF
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">Henry</p>
                        <p className="text-xs text-slate-500">Free Plan</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
