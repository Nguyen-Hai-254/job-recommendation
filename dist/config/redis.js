"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
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
exports.default = redisClient;
//# sourceMappingURL=redis.js.map