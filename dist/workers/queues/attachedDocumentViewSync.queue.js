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
const attached_documentRepository = connectDB_1.myDataSource.getRepository(entities_1.AttachedDocument);
const attachedDocumentViewSyncQueue = new bull_1.default('attached-document-view-sync', { redis: config_1.RedisOpts, defaultJobOptions: { ...config_1.JobOpts, priority: 1, attempts: 3 } });
attachedDocumentViewSyncQueue.process('attached-document-view-sync', async (payload, done) => {
    try {
        const views = await redis_1.default.HGETALL('attached-document-views');
        await attached_documentRepository.manager.transaction(async (manager) => {
            const updatePromises = Object.entries(views).map(([userId, view]) => manager.update(entities_1.AttachedDocument, { userId: userId }, { view: parseInt(view, 10) }));
            await Promise.all(updatePromises);
        });
        done();
    }
    catch (err) {
        done(err);
    }
});
attachedDocumentViewSyncQueue.process('attached-document-view-sync-and-delete', async (payload, done) => {
    try {
        const views = await redis_1.default.HGETALL('attached-document-views');
        await attached_documentRepository.manager.transaction(async (manager) => {
            const updatePromises = Object.entries(views).map(([userId, view]) => manager.update(entities_1.AttachedDocument, { userId: userId }, { view: parseInt(view, 10) }));
            await Promise.all(updatePromises);
        });
        await redis_1.default.del('attached-document-views');
        done();
    }
    catch (err) {
        done(err);
    }
});
attachedDocumentViewSyncQueue.on('active', (job, jobPromise) => {
    console.log('attached document view sync started');
});
attachedDocumentViewSyncQueue.on('completed', (job, result) => {
    console.log('attached document view sync completed:', result);
});
attachedDocumentViewSyncQueue.on('failed', (job, err) => {
    console.log('attached document view sync failed:', err.message);
});
exports.default = attachedDocumentViewSyncQueue;
//# sourceMappingURL=attachedDocumentViewSync.queue.js.map