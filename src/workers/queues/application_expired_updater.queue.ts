import Queue from 'bull';
import { RedisOpts, JobOpts } from '../../config'
import { myDataSource } from "../../config/connectDB"
import { approvalStatus } from "../../utils/enum"
import { Application } from "../../entities"

const applicationRepository = myDataSource.getRepository(Application);

const applicationExpiredUpdaterQueue = new Queue('application-expired-updater', { 
    redis: RedisOpts, 
    defaultJobOptions: {
        ...JobOpts, 
        priority: 8, 
        attempts: 1, 
        backoff: {
            type: 'fixed',
            delay: 3600000 // 1h
    }}});

applicationExpiredUpdaterQueue.process('application-expired-updater', async (payload, done) => {
    try {
        const applications = await applicationRepository
            .createQueryBuilder('application')
            .leftJoin('application.jobPosting', 'jobPosting')
            .where('application.status = :status', { status: approvalStatus.pending })
            .andWhere('DATE_ADD(jobPosting.applicationDeadline, INTERVAL 15 DAY) < CURRENT_DATE()')
            .getMany();

        const ids = applications.map(app => app.application_id);

        if (ids.length > 0) {
            const result = await applicationRepository
                .createQueryBuilder()
                .update(Application)
                .set({ status: approvalStatus.expired })
                .whereInIds(ids)
                .execute();
            console.log(result)
        }
        done()
    } catch (err) {
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

export default applicationExpiredUpdaterQueue;