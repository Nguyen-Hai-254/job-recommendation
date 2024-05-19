"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("../config/redis"));
class RedisServices {
}
RedisServices.setPasswordResetToken = (userId, token, expiresAt) => {
    return redis_1.default.set(`password-reset-${userId}`, token, { EX: Math.floor((expiresAt - Date.now()) / 1000) });
};
RedisServices.getPasswordResetToken = (userId) => {
    return redis_1.default.get(`password-reset-${userId}`);
};
exports.default = RedisServices;
//# sourceMappingURL=redisServices.js.map