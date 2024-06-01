"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.queuesList = exports.queueOptions = exports.JobOpts = exports.RedisOpts = void 0;
require('dotenv').config();
exports.RedisOpts = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD
};
exports.JobOpts = {
    attempts: 1,
    priority: 1,
    backoff: {
        type: 'fixed',
        delay: 60000 // 1p
    },
    removeOnComplete: true,
    removeOnFail: 50
};
exports.queueOptions = {
    redis: exports.RedisOpts,
    defaultJobOptions: exports.JobOpts
};
exports.queuesList = ['mail', 'notification', 'post-view-sync', 'online-profile-view-sync', 'attached-document-view-sync', 'post-expired-updater', 'application-expired-updater'];
exports.PORT = Number(process.env.PORT);
//# sourceMappingURL=index.js.map