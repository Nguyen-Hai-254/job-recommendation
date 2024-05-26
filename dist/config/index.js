"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.queuesList = exports.queueOptions = void 0;
require('dotenv').config();
exports.queueOptions = {
    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD
    },
    defaultJobOptions: {
        attempts: 1,
        backoff: {
            type: 'fixed',
            delay: 60000 // 1h
        },
        removeOnComplete: true,
        removeOnFail: 50
    }
};
exports.queuesList = ['mail', 'notification'];
exports.PORT = Number(process.env.PORT);
//# sourceMappingURL=index.js.map