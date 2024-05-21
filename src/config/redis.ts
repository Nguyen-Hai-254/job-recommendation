import { createClient } from 'redis';

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    },
    password: process.env.REDIS_PASSWORD
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

redisClient.connect().then(() => {
  console.log('Connected to Redis');
});

export default redisClient;