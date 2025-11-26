import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import {
    addToWaitingQueue,
    popFromWaitingQueue,
    createRoom,
    getRoom,
    deleteRoom,
    removeFromWaitingQueue
} from './redis';

export const setupSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        // Handle Random Connect
        socket.on('find_match', async () => {
            console.log(`User ${socket.id} looking for match`);

            // Try to find a partner
            const partnerId = await popFromWaitingQueue();

            if (partnerId && partnerId !== socket.id) {
                // Check if partner is still connected
                const partnerSocket = io.sockets.sockets.get(partnerId);

                if (partnerSocket) {
                    // Match found!
                    const roomId = uuidv4();
                    await createRoom(roomId, socket.id, partnerId);

                    socket.join(roomId);
                    partnerSocket.join(roomId);

                    io.to(roomId).emit('match_found', { roomId, initiator: socket.id });
                    console.log(`Match found: ${roomId} (${socket.id} <-> ${partnerId})`);
                } else {
                    // Partner disconnected, put self in queue
                    await addToWaitingQueue(socket.id);
                }
            } else {
                // No one waiting, add self to queue
                await addToWaitingQueue(socket.id);
            }
        });

        // Handle Invite Link Join
        socket.on('join_room', async ({ roomId }) => {
            const room = await getRoom(roomId);
            // In a real app, we'd check if room is full or valid
            // For now, just join
            socket.join(roomId);
            socket.to(roomId).emit('user_joined', { userId: socket.id });
        });

        // Signaling: Offer
        socket.on('offer', (data) => {
            socket.to(data.roomId).emit('offer', data);
        });

        // Signaling: Answer
        socket.on('answer', (data) => {
            socket.to(data.roomId).emit('answer', data);
        });

        // Signaling: ICE Candidate
        socket.on('ice-candidate', (data) => {
            socket.to(data.roomId).emit('ice-candidate', data);
        });

        // Chat Message
        socket.on('message', (data) => {
            // Basic profanity filter could go here
            io.to(data.roomId).emit('message', {
                sender: socket.id,
                text: data.text,
                timestamp: Date.now(),
            });
        });

        // Disconnect
        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${socket.id}`);
            await removeFromWaitingQueue(socket.id);
            // Notify rooms? 
            // In a real app we'd look up which room they were in and notify the peer
        });
    });
};
