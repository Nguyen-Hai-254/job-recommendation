"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectDB_1 = require("../config/connectDB");
const enum_1 = require("../utils/enum");
const JobPosting_1 = require("../entity/JobPosting");
const moment_1 = __importDefault(require("moment"));
const cron = require('node-cron');
const jobPostingRepository = connectDB_1.myDataSource.getRepository(JobPosting_1.JobPosting);
const jobCron = cron.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield jobPostingRepository
            .createQueryBuilder()
            .update(JobPosting_1.JobPosting)
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
}), {
    scheduled: false,
    timezone: "Asia/Ho_Chi_Minh"
});
module.exports = jobCron;
//# sourceMappingURL=updateExpiredJobStatusCron.js.map