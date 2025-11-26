'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import HeroCard from '@/components/HeroCard';
import ContentGrid from '@/components/ContentGrid';
import UserStatus from '@/components/UserStatus';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export default function Home() {
    const router = useRouter();
    const [socket, setSocket] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);

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
        <main className="p-8 md:p-12 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-2xl font-bold text-white tracking-wider uppercase">Home</h1>
                <UserStatus />
            </div>

            {/* Hero Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-6">What's New</h2>
                <HeroCard
                    title="How To: Dominate with Zaahen"
                    subtitle="Game Updates"
                    description="Master your Zaahen to dominate top lane and beyond with the ultimate guide from Skill-Capped."
                    image="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg"
                    onAction={handleRandomConnect}
                    actionLabel={isSearching ? "Searching..." : "Play Now"}
                    loading={isSearching}
                />
            </div>

            {/* Content Grid */}
            <ContentGrid />
        </main>
    );
}
