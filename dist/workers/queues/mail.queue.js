"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const config_1 = require("../../config");
const mailServices_1 = __importDefault(require("../../services/mailServices"));
const mailQueue = new bull_1.default('mail', { redis: config_1.RedisOpts, defaultJobOptions: { ...config_1.JobOpts, priority: 6 } });
mailQueue.process(async (payload, done) => {
    try {
        const { emails, subject, html } = payload.data;
        await mailServices_1.default.sendEmailForUsers(emails, subject, html);
        done();
    }
    catch (err) {
        done(err);
    }
});
mailQueue.on('active', (job, jobPromise) => {
    console.log('send mails started');
    // console.log('send mails started:', job.data);
});
mailQueue.on('completed', (job, result) => {
    console.log('send mails completed:', result);
});
mailQueue.on('failed', (job, err) => {
    console.log('send mails failed:', err.message);
});
module.exports = mailQueue;
//# sourceMappingURL=mail.queue.js.map