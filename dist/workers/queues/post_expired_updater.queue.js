"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const config_1 = require("../../config");
const connectDB_1 = require("../../config/connectDB");
const enum_1 = require("../../utils/enum");
const entities_1 = require("../../entities");
const moment_1 = __importDefault(require("moment"));
const jobPostingRepository = connectDB_1.myDataSource.getRepository(entities_1.JobPosting);
const postExpiredUpdaterQueue = new bull_1.default('post-expired-updater', {
    redis: config_1.RedisOpts,
    defaultJobOptions: {
        ...config_1.JobOpts,
        priority: 8,
        attempts: 6,
        backoff: {
            type: 'fixed',
            delay: 3600000 // 1h
        }
    }
});
postExpiredUpdaterQueue.process('post-expired-updater', async (payload, done) => {
    try {
        const result = await jobPostingRepository
            .createQueryBuilder()
            .update(entities_1.JobPosting)
            .set({
            status: enum_1.approvalStatus.expired
        })
            .where('status = :status', { status: enum_1.approvalStatus.approved })
            .andWhere('applicationDeadline < :currentDate', { currentDate: (0, moment_1.default)(new Date()).subtract(1, 'days').toDate() })
            .execute();
        console.log(result);
        done();
    }
    catch (err) {
        done(err);
    }
});
postExpiredUpdaterQueue.on('active', (job, jobPromise) => {
    console.log('post expired updater started');
});
postExpiredUpdaterQueue.on('completed', (job, result) => {
    console.log('post expired updater completed:', result);
});
postExpiredUpdaterQueue.on('failed', (job, err) => {
    console.log('post expired updater failed:', err.message);
});
exports.default = postExpiredUpdaterQueue;
//# sourceMappingURL=post_expired_updater.queue.js.map