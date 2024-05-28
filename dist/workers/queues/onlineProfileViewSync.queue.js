"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const config_1 = require("../../config");
const redis_1 = __importDefault(require("../../config/redis"));
const entities_1 = require("../../entities");
const connectDB_1 = require("../../config/connectDB");
const online_profileRepository = connectDB_1.myDataSource.getRepository(entities_1.OnlineProfile);
const onlineProfileViewSyncQueue = new bull_1.default('online-profile-view-sync', { redis: config_1.RedisOpts, defaultJobOptions: { ...config_1.JobOpts, priority: 1, attempts: 3 } });
onlineProfileViewSyncQueue.process('online-profile-view-sync', async (payload, done) => {
    try {
        const views = await redis_1.default.HGETALL('online-profile-views');
        await online_profileRepository.manager.transaction(async (manager) => {
            const updatePromises = Object.entries(views).map(([userId, view]) => manager.update(entities_1.OnlineProfile, { userId: userId }, { view: parseInt(view, 10) }));
            await Promise.all(updatePromises);
        });
        done();
    }
    catch (err) {
        done(err);
    }
});
onlineProfileViewSyncQueue.process('online-profile-view-sync-and-delete', async (payload, done) => {
    try {
        const views = await redis_1.default.HGETALL('online-profile-views');
        await online_profileRepository.manager.transaction(async (manager) => {
            const updatePromises = Object.entries(views).map(([userId, view]) => manager.update(entities_1.OnlineProfile, { userId: userId }, { view: parseInt(view, 10) }));
            await Promise.all(updatePromises);
        });
        await redis_1.default.del('online-profile-views');
        done();
    }
    catch (err) {
        done(err);
    }
});
onlineProfileViewSyncQueue.on('active', (job, jobPromise) => {
    console.log('online profile view sync started');
});
onlineProfileViewSyncQueue.on('completed', (job, result) => {
    console.log('online profile view sync completed:', result);
});
onlineProfileViewSyncQueue.on('failed', (job, err) => {
    console.log('online profile view sync failed:', err.message);
});
exports.default = onlineProfileViewSyncQueue;
//# sourceMappingURL=onlineProfileViewSync.queue.js.map