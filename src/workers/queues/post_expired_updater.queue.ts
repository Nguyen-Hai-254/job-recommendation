import Queue from 'bull';
import { RedisOpts, JobOpts } from '../../config'
import { myDataSource } from "../../config/connectDB"
import { approvalStatus } from "../../utils/enum"
import { JobPosting } from "../../entities"
import moment from "moment"

const jobPostingRepository = myDataSource.getRepository(JobPosting);

const postExpiredUpdaterQueue = new Queue('post-expired-updater', { 
    redis: RedisOpts, 
    defaultJobOptions: {
        ...JobOpts, 
        priority: 8, 
        attempts: 6, 
        backoff: {
            type: 'fixed',
            delay: 3600000 // 1h
    }}});

postExpiredUpdaterQueue.process('post-expired-updater', async (payload, done) => {
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
        console.log(result)
        done()
    } catch (err) {
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

export default postExpiredUpdaterQueue;