import { myDataSource } from "../config/connectDB"
import { approvalStatus } from "../utils/enum"
import { JobPosting } from "../entity/JobPosting"
import moment from "moment"
const cron = require('node-cron');

const jobPostingRepository = myDataSource.getRepository(JobPosting);

const jobCron = cron.schedule('0 0 * * *', async () => {
  try {
    const result = await jobPostingRepository
        .createQueryBuilder()
        .update(JobPosting)
        .set({
            status: approvalStatus.expired
        })
        .where('status = :status', { status: approvalStatus.approved })
        .andWhere('applicationDeadline < :currentDate', { currentDate: moment(new Date()).subtract(1, 'days').toDate() })
        .execute();
    console.log('update expired status for job posting: \n', result);
  } catch (err) {
    console.error('Error in JobCron', err);
  }
}, {
    scheduled: false,
    timezone: "Asia/Ho_Chi_Minh"
});


module.exports = jobCron;