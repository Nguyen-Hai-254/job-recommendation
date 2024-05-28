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
const jobPostingRepository = connectDB_1.myDataSource.getRepository(entities_1.JobPosting);
const postViewSyncQueue = new bull_1.default('post-view-sync', { redis: config_1.RedisOpts, defaultJobOptions: { ...config_1.JobOpts, priority: 4, attempts: 3 } });
postViewSyncQueue.process('post-view-sync', async (payload, done) => {
    try {
        const postViews = await redis_1.default.HGETALL('post-views');
        await jobPostingRepository.manager.transaction(async (manager) => {
            const updatePromises = Object.entries(postViews).map(([postId, view]) => manager.update(entities_1.JobPosting, { postId: postId }, { view: parseInt(view, 10) }));
            await Promise.all(updatePromises);
        });
        done();
    }
    catch (err) {
        done(err);
    }
});
postViewSyncQueue.process('post-view-sync-and-delete', async (payload, done) => {
    try {
        const postViews = await redis_1.default.HGETALL('post-views');
        await jobPostingRepository.manager.transaction(async (manager) => {
            const updatePromises = Object.entries(postViews).map(([postId, view]) => manager.update(entities_1.JobPosting, { postId: postId }, { view: parseInt(view, 10) }));
            await Promise.all(updatePromises);
        });
        await redis_1.default.del('post-views');
        done();
    }
    catch (err) {
        done(err);
    }
});
postViewSyncQueue.on('active', (job, jobPromise) => {
    console.log('post view sync started');
    // console.log('send mails started:', job.data);
});
postViewSyncQueue.on('completed', (job, result) => {
    console.log('post view sync completed:', result);
});
postViewSyncQueue.on('failed', (job, err) => {
    console.log('post view sync failed:', err.message);
});
exports.default = postViewSyncQueue;
//# sourceMappingURL=postViewSync.queue.js.map