interface CardProps {
    title: string;
    category: string;
    image: string;
}

function Card({ title, category, image }: CardProps) {
    return (
        <div className="flex flex-col gap-3 group cursor-pointer">
            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/5">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${image})` }}
                ></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <span className="text-riot-accent font-bold text-xs">T</span>
                    </div>
                </div>
            </div>

            <div>
                <div className="text-xs font-bold text-riot-muted uppercase tracking-wider mb-1">{category}</div>
                <h3 className="text-white font-bold text-lg group-hover:text-riot-accent transition-colors line-clamp-2">{title}</h3>
            </div>
        </div>
    );
}

export default function ContentGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <Card
                title="K/DA Ahri Unbound Showcase"
                category="Game Updates"
                image="https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt2a8d492ef639e4e4/5f9b422087d8500d8d089759/KDA_Ahri_Unbound_Splash_v2.jpg"
            />
            <Card
                title="Arcane Brawler Vi 1/7 Statue"
                category="Merch"
                image="https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blte08663242d57312e/64e67a6d8a2013651b725666/101023_Arcane_Vi_Statue_Promo_1920x1080.jpg"
            />
            <Card
                title="Zaahen Champion Theme"
                category="Media"
                image="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Azir_0.jpg"
            />
            <Card
                title="God King Darius Unbound & Fields of Justice"
                category="Game Updates"
                image="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Darius_15.jpg"
            />
        </div>
    );
}
