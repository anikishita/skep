import { Home, User, Settings, Grid, Play } from 'lucide-react';

export default function Sidebar() {
    return (
        <div className="w-16 md:w-20 h-screen bg-riot-sidebar flex flex-col items-center py-6 border-r border-white/5 z-50 fixed left-0 top-0">
            {/* Logo */}
            <div className="mb-8 p-2">
                <div className="w-8 h-8 bg-riot-accent rounded-sm rotate-45 flex items-center justify-center">
                    <div className="w-4 h-4 bg-riot-dark -rotate-45"></div>
                </div>
            </div>

            {/* Nav Items */}
            <div className="flex-1 flex flex-col gap-6 w-full px-2">
                <button className="p-3 rounded-lg bg-white/10 text-white flex justify-center group relative">
                    <Home size={24} />
                    <div className="absolute left-0 top-0 h-full w-1 bg-riot-accent rounded-l-lg"></div>
                </button>

                <button className="p-3 rounded-lg text-riot-muted hover:bg-riot-hover hover:text-white transition-colors flex justify-center">
                    <Grid size={24} />
                </button>

                <button className="p-3 rounded-lg text-riot-muted hover:bg-riot-hover hover:text-white transition-colors flex justify-center">
                    <User size={24} />
                </button>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-6 w-full px-2 mb-4">
                <button className="p-3 rounded-lg text-riot-muted hover:bg-riot-hover hover:text-white transition-colors flex justify-center">
                    <Settings size={24} />
                </button>
            </div>
        </div>
    );
}
