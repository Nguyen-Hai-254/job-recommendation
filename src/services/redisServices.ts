import redisClient from '../config/redis';

export default class RedisServices {
    static setPasswordResetToken = (userId, token, expiresAt) => {
        return redisClient.set(`password-reset-${userId}`, token, {EX: Math.floor((expiresAt - Date.now()) / 1000)});
    }
    static getPasswordResetToken = (userId) => {
        return redisClient.get(`password-reset-${userId}`);
    }
}