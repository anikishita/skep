'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { useWebRTC } from '@/hooks/useWebRTC';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Send } from 'lucide-react';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export default function Room() {
    const params = useParams();
    const router = useRouter();
    const roomId = params.id as string;

    const [socket, setSocket] = useState<any>(null);
    const { localStream, remoteStream, connectionState, createOffer } = useWebRTC(socket, roomId);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
    const [inputText, setInputText] = useState('');
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.emit('join_room', { roomId });

        newSocket.on('match_found', (data: { initiator: string }) => {
            if (data.initiator === newSocket.id) {
                createOffer();
            }
        });

        // If we joined an existing room (via link), we might need to initiate or wait.
        // For simplicity in this demo, we'll assume 'match_found' triggers the flow for random.
        // For invite links, we might need a 'user_joined' event to trigger offer.
        newSocket.on('user_joined', () => {
            createOffer();
        });

        newSocket.on('message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            setIsVideoOff(!isVideoOff);
        }
    };

    const leaveRoom = () => {
        router.push('/');
    };

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !socket) return;
        socket.emit('message', { roomId, text: inputText });
        setInputText('');
    };

    return (
        <div className="h-screen w-full bg-riot-dark overflow-hidden flex flex-col relative">
            {/* Main Video Area */}
            <div className="flex-1 relative flex items-center justify-center p-4 gap-4">

                {/* Remote Video (Main) */}
                <div className="relative w-full h-full max-w-6xl bg-black rounded-lg overflow-hidden shadow-2xl border border-riot-panel">
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    {connectionState !== 'connected' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-riot-dark/80 text-riot-muted animate-pulse">
                            <div className="text-center">
                                <div className="text-2xl font-bold mb-2">Connecting...</div>
                                <div className="text-sm">Waiting for peer connection</div>
                            </div>
                        </div>
                    )}

                    {/* Local Video (PIP) */}
                    <div className="absolute bottom-4 right-4 w-48 h-36 bg-black rounded border-2 border-riot-accent overflow-hidden shadow-lg transition-all hover:scale-105">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="h-20 bg-riot-panel border-t border-riot-muted/20 flex items-center justify-center gap-6 px-8 z-20">
                <button
                    onClick={toggleMute}
                    className={`p-4 rounded-full transition-all ${isMuted ? 'bg-riot-danger text-white' : 'bg-riot-dark text-riot-text hover:bg-riot-accent hover:text-riot-dark'}`}
                >
                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>

                <button
                    onClick={leaveRoom}
                    className="p-4 rounded-full bg-riot-danger text-white hover:bg-red-600 transition-all shadow-lg hover:shadow-red-500/50"
                >
                    <PhoneOff size={24} />
                </button>

                <button
                    onClick={toggleVideo}
                    className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-riot-danger text-white' : 'bg-riot-dark text-riot-text hover:bg-riot-accent hover:text-riot-dark'}`}
                >
                    {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                </button>

                <button
                    onClick={() => setShowChat(!showChat)}
                    className={`p-4 rounded-full transition-all absolute right-8 ${showChat ? 'bg-riot-highlight text-riot-dark' : 'bg-riot-dark text-riot-text'}`}
                >
                    <MessageSquare size={24} />
                </button>
            </div>

            {/* Chat Panel */}
            <div className={`absolute top-0 right-0 h-[calc(100vh-80px)] w-80 bg-riot-panel border-l border-riot-muted/20 transform transition-transform duration-300 flex flex-col ${showChat ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 border-b border-riot-muted/20 font-bold text-riot-accent">
                    Chat
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.sender === socket?.id ? 'items-end' : 'items-start'}`}>
                            <div className={`px-3 py-2 rounded max-w-[80%] text-sm ${msg.sender === socket?.id ? 'bg-riot-accent text-riot-dark' : 'bg-riot-dark text-riot-text border border-riot-muted/30'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={sendMessage} className="p-4 border-t border-riot-muted/20 flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-riot-dark border border-riot-muted/30 rounded px-3 py-2 text-sm text-riot-text focus:outline-none focus:border-riot-highlight"
                    />
                    <button type="submit" className="p-2 bg-riot-highlight text-riot-dark rounded hover:bg-opacity-80">
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}
