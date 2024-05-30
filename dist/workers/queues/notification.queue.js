"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const config_1 = require("../../config");
const notificationServices_1 = __importDefault(require("../../services/notificationServices"));
const notificationQueue = new bull_1.default('notification', { redis: config_1.RedisOpts, defaultJobOptions: { ...config_1.JobOpts, priority: 2 } });
notificationQueue.process(async (payload, done) => {
    try {
        await notificationServices_1.default.saveNotification(payload.data);
        done();
    }
    catch (err) {
        done(err);
    }
});
notificationQueue.on('active', (job, jobPromise) => {
    console.log('create_notification started'); // job.data
    // console.log('create_notification started:', job.data); 
});
notificationQueue.on('completed', (job, result) => {
    console.log('create_notification completed:', result);
});
notificationQueue.on('failed', (job, err) => {
    console.log('create_notification failed:', err.message);
});
module.exports = notificationQueue;
//# sourceMappingURL=notification.queue.js.map