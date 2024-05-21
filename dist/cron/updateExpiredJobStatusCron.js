"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectDB_1 = require("../config/connectDB");
const enum_1 = require("../utils/enum");
const entities_1 = require("../entities");
const moment_1 = __importDefault(require("moment"));
const cron = require('node-cron');
const jobPostingRepository = connectDB_1.myDataSource.getRepository(entities_1.JobPosting);
const jobCron = cron.schedule('0 0 * * *', async () => {
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
        console.log('update expired status for job posting: \n', result);
    }
    catch (err) {
        console.error('Error in JobCron', err);
    }
}, {
    scheduled: false,
    timezone: "Asia/Ho_Chi_Minh"
});
module.exports = jobCron;
//# sourceMappingURL=updateExpiredJobStatusCron.js.map