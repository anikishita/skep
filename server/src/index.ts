import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { setupSocket } from './socket';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

setupSocket(io);

// API Routes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.post('/api/report', (req, res) => {
    // Mock report endpoint
    console.log('Report received:', req.body);
    res.status(200).json({ success: true });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
