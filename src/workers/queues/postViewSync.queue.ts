import Queue from 'bull';
import { RedisOpts, JobOpts } from '../../config'
import redisClient from '../../config/redis'
import { JobPosting } from "../../entities"
import { myDataSource } from "../../config/connectDB"

const jobPostingRepository = myDataSource.getRepository(JobPosting);

const postViewSyncQueue = new Queue('post-view-sync', { redis: RedisOpts, defaultJobOptions: {...JobOpts, priority: 3, attempts: 3 } });

postViewSyncQueue.process('post-view-sync', async (payload, done) => {
    try {
        const postViews = await redisClient.HGETALL('post-views');
        await jobPostingRepository.manager.transaction(async (manager) => {
            const updatePromises = Object.entries(postViews).map(([postId, view]) =>
                manager.update(JobPosting, { postId: postId }, { view: parseInt(view, 10) })
            );
            await Promise.all(updatePromises);
        });
        done()
    } catch (err) {
        done(err);
    }
});

postViewSyncQueue.process('post-view-sync-and-delete', async (payload, done) => {
    try {
        const postViews = await redisClient.HGETALL('post-views');
        await jobPostingRepository.manager.transaction(async (manager) => {
            const updatePromises = Object.entries(postViews).map(([postId, view]) =>
                manager.update(JobPosting, { postId: postId }, { view: parseInt(view, 10) })
            );
            await Promise.all(updatePromises);
        });
        await redisClient.del('post-views');
        done()
    } catch (err) {
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

export default postViewSyncQueue;