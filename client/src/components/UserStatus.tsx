import { User } from 'lucide-react';

export default function UserStatus() {
    return (
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
                <span className="text-white font-bold text-sm">Anonymous</span>
                <span className="text-riot-highlight text-xs font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-riot-highlight"></span>
                    Online
                </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-riot-panel border border-riot-accent flex items-center justify-center relative">
                <User className="text-riot-muted" size={20} />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-riot-highlight rounded-full border-2 border-riot-dark"></div>
            </div>
        </div>
    );
}
