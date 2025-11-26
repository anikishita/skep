'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { Video, Users, Share2, Shield } from 'lucide-react';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export default function Home() {
    const router = useRouter();
    const [socket, setSocket] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [onlineCount, setOnlineCount] = useState(0); // Mock

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to signaling server');
        });

        newSocket.on('match_found', ({ roomId }: { roomId: string }) => {
            setIsSearching(false);
            router.push(`/room/${roomId}`);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [router]);

    const handleRandomConnect = () => {
        if (!socket) return;
        setIsSearching(true);
        socket.emit('find_match');
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 bg-hextech opacity-20 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-riot-accent to-transparent opacity-50"></div>

            <div className="z-10 w-full max-w-4xl text-center space-y-12">
                {/* Header */}
                <div className="space-y-4">
                    <h1 className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-riot-text to-riot-muted drop-shadow-lg">
                        ANTIGRAVITY <span className="text-riot-highlight">CONNECT</span>
                    </h1>
                    <p className="text-riot-muted text-xl max-w-2xl mx-auto">
                        Instant, anonymous, peer-to-peer video connections. No login required.
                    </p>
                </div>

                {/* Main Action Panel */}
                <div className="riot-panel p-12 rounded-sm border-t-4 border-t-riot-accent relative group">
                    <div className="absolute inset-0 bg-riot-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                        <button
                            onClick={handleRandomConnect}
                            disabled={isSearching}
                            className="riot-btn w-full md:w-auto text-lg py-4 px-12 min-w-[250px] flex items-center justify-center gap-3"
                        >
                            {isSearching ? (
                                <>
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></span>
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Video className="w-6 h-6" />
                                    Random Connect
                                </>
                            )}
                        </button>

                        <div className="text-riot-muted font-mono text-sm">OR</div>

                        <button className="riot-btn w-full md:w-auto text-lg py-4 px-12 min-w-[250px] border-riot-highlight text-riot-highlight hover:bg-riot-highlight hover:text-riot-dark hover:shadow-[0_0_15px_rgba(10,200,185,0.5)] flex items-center justify-center gap-3">
                            <Share2 className="w-6 h-6" />
                            Create Invite
                        </button>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-8 text-riot-muted text-sm">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{120 + Math.floor(Math.random() * 50)} Online</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>Encrypted & Anonymous</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-riot-muted/50 text-xs mt-12">
                    By connecting, you agree to our Terms of Service. Sessions are not recorded.
                </div>
            </div>
        </main>
    );
}
