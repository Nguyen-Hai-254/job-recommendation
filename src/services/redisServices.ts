import redisClient from '../config/redis';

export default class RedisServices {
    static setPasswordResetToken = (userId, token, expiresAt) => {
        return redisClient.set(`password-reset-${userId}`, token, {EX: Math.floor((expiresAt - Date.now()) / 1000)});
    }
    static getPasswordResetToken = (userId) => {
        return redisClient.get(`password-reset-${userId}`);
    }
    static setBlockedToken = (token) => {
        return redisClient.set(`blocked-token-${token}`, token, { EX: 60 * 60 * 24 });
    }
    static getBlockedToken = (token) => {
        return redisClient.get(`blocked-token-${token}`);
    }
}