import Queue from 'bull';
import { RedisOpts, JobOpts } from '../../config'
import redisClient from '../../config/redis'
import { OnlineProfile } from "../../entities"
import { myDataSource } from "../../config/connectDB"

const online_profileRepository = myDataSource.getRepository(OnlineProfile);

const onlineProfileViewSyncQueue = new Queue('online-profile-view-sync', { redis: RedisOpts, defaultJobOptions: {...JobOpts, priority: 1, attempts: 3 } });

onlineProfileViewSyncQueue.process('online-profile-view-sync', async (payload, done) => {
    try {
        const views = await redisClient.HGETALL('online-profile-views');
        await online_profileRepository.manager.transaction(async (manager) => {
            const updatePromises = Object.entries(views).map(([userId, view]) =>
                manager.update(OnlineProfile, { userId: userId }, { view: parseInt(view, 10) })
            );
            await Promise.all(updatePromises);
        });
        done()
    } catch (err) {
        done(err);
    }
});

onlineProfileViewSyncQueue.process('online-profile-view-sync-and-delete', async (payload, done) => {
    try {
        const views = await redisClient.HGETALL('online-profile-views');
        await online_profileRepository.manager.transaction(async (manager) => {
            const updatePromises = Object.entries(views).map(([userId, view]) =>
                manager.update(OnlineProfile, { userId: userId }, { view: parseInt(view, 10) })
            );
            await Promise.all(updatePromises);
        });
        await redisClient.del('online-profile-views');
        done()
    } catch (err) {
        done(err);
    }
});

onlineProfileViewSyncQueue.on('active', (job, jobPromise) => {
    console.log('online profile view sync started'); 
});
  
onlineProfileViewSyncQueue.on('completed', (job, result) => {
    console.log('online profile view sync completed:', result);
  });
  
onlineProfileViewSyncQueue.on('failed', (job, err) => {
    console.log('online profile view sync failed:', err.message);
});

export default onlineProfileViewSyncQueue;