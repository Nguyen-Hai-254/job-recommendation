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
const applicationRepository = connectDB_1.myDataSource.getRepository(entities_1.Application);
const applicationExpiredUpdaterQueue = new bull_1.default('application-expired-updater', {
    redis: config_1.RedisOpts,
    defaultJobOptions: {
        ...config_1.JobOpts,
        priority: 8,
        attempts: 1,
        backoff: {
            type: 'fixed',
            delay: 3600000 // 1h
        }
    }
});
applicationExpiredUpdaterQueue.process('application-expired-updater', async (payload, done) => {
    try {
        const applications = await applicationRepository
            .createQueryBuilder('application')
            .leftJoin('application.jobPosting', 'jobPosting')
            .where('application.status = :status', { status: enum_1.approvalStatus.pending })
            .andWhere('DATE_ADD(jobPosting.applicationDeadline, INTERVAL 15 DAY) < CURRENT_DATE()')
            .getMany();
        const ids = applications.map(app => app.application_id);
        if (ids.length > 0) {
            const result = await applicationRepository
                .createQueryBuilder()
                .update(entities_1.Application)
                .set({ status: enum_1.approvalStatus.expired })
                .whereInIds(ids)
                .execute();
            console.log(result);
        }
        done();
    }
    catch (err) {
        console.log(err);
        done(err);
    }
});
applicationExpiredUpdaterQueue.on('active', (job, jobPromise) => {
    console.log('application expired updater started');
});
applicationExpiredUpdaterQueue.on('completed', (job, result) => {
    console.log('application expired updater completed:', result);
});
applicationExpiredUpdaterQueue.on('failed', (job, err) => {
    console.log('application expired updater failed:', err.message);
});
exports.default = applicationExpiredUpdaterQueue;
//# sourceMappingURL=application_expired_updater.queue.js.map