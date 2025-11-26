import { Play } from 'lucide-react';

interface HeroCardProps {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    onAction: () => void;
    actionLabel: string;
    loading?: boolean;
}

export default function HeroCard({ title, subtitle, description, image, onAction, actionLabel, loading }: HeroCardProps) {
    return (
        <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden group border border-white/5 shadow-2xl">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${image})` }}
            ></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-hero-gradient"></div>

            {/* Content */}
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-riot-accent flex items-center justify-center text-riot-dark font-bold text-xs">L</div>
                    <span className="text-riot-accent font-bold tracking-wider text-sm uppercase">{subtitle}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{title}</h1>
                <p className="text-riot-muted text-lg mb-8 leading-relaxed max-w-lg">{description}</p>

                <button
                    onClick={onAction}
                    disabled={loading}
                    className="w-fit flex items-center gap-3 bg-riot-accent text-riot-dark px-8 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></span>
                    ) : (
                        <Play fill="currentColor" size={20} />
                    )}
                    {actionLabel}
                </button>
            </div>
        </div>
    );
}
