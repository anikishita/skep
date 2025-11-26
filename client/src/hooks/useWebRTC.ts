import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // In production, add TURN servers here
    ],
};

export const useWebRTC = (socket: Socket | null, roomId: string) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
    const peerConnection = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        if (!socket) return;

        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnection.current = pc;

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', {
                    roomId,
                    candidate: event.candidate,
                });
            }
        };

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
            setConnectionState(pc.connectionState);
        };

        // Handle remote stream
        pc.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        // Get local media
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setLocalStream(stream);
                stream.getTracks().forEach((track) => {
                    pc.addTrack(track, stream);
                });

                // Listen for offers (if we are the callee)
                socket.on('offer', async (data) => {
                    if (!peerConnection.current) return;
                    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
                    const answer = await peerConnection.current.createAnswer();
                    await peerConnection.current.setLocalDescription(answer);
                    socket.emit('answer', {
                        roomId,
                        answer,
                    });
                });

                // Listen for answers (if we are the caller)
                socket.on('answer', async (data) => {
                    if (!peerConnection.current) return;
                    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                });

                // Listen for ICE candidates
                socket.on('ice-candidate', async (data) => {
                    if (!peerConnection.current) return;
                    try {
                        await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                    } catch (e) {
                        console.error('Error adding received ice candidate', e);
                    }
                });

                // If we are the initiator (determined by who joined last or logic), we might create offer.
                // For simplicity, let's say the one who receives 'match_found' with 'initiator' flag creates offer.
                // But here we just set up listeners. The component will trigger the offer.
            })
            .catch((err) => console.error('Error accessing media devices:', err));

        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            if (peerConnection.current) {
                peerConnection.current.close();
            }
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
        };
    }, [socket, roomId]);

    const createOffer = async () => {
        if (!peerConnection.current || !socket) return;
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socket.emit('offer', {
            roomId,
            offer,
        });
    };

    return { localStream, remoteStream, connectionState, createOffer };
};
