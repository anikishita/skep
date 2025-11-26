import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(REDIS_URL);
export const subRedis = new Redis(REDIS_URL);

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error', err));

// Keys
const WAITING_QUEUE = 'waiting_queue';
const ROOM_PREFIX = 'room:';
const USER_PREFIX = 'user:';

export const addToWaitingQueue = async (socketId: string) => {
    await redis.rpush(WAITING_QUEUE, socketId);
};

export const popFromWaitingQueue = async (): Promise<string | null> => {
    return await redis.lpop(WAITING_QUEUE);
};

export const removeFromWaitingQueue = async (socketId: string) => {
    await redis.lrem(WAITING_QUEUE, 0, socketId);
};

export const createRoom = async (roomId: string, user1: string, user2: string) => {
    const roomKey = `${ROOM_PREFIX}${roomId}`;
    await redis.hmset(roomKey, {
        user1,
        user2,
        created_at: Date.now(),
    });
    // Expire room after 24 hours to clean up
    await redis.expire(roomKey, 86400);
};

export const getRoom = async (roomId: string) => {
    return await redis.hgetall(`${ROOM_PREFIX}${roomId}`);
};

export const deleteRoom = async (roomId: string) => {
    await redis.del(`${ROOM_PREFIX}${roomId}`);
};
