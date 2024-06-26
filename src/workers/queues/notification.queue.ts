import Queue from 'bull';
import { RedisOpts, JobOpts } from '../../config';
import NotificationServices from '../../services/notificationServices';

const notificationQueue = new Queue('notification', { redis: RedisOpts, defaultJobOptions: {...JobOpts, priority: 2} });

notificationQueue.process(async (payload, done) => {
    try {
        await NotificationServices.saveNotification(payload.data);
        done();
    } catch (err) {
        done(err);
    }
});

notificationQueue.on('active', (job, jobPromise) => {
    console.log('create_notification started'); // job.data
    // console.log('create_notification started:', job.data); 

});
  
notificationQueue.on('completed', (job, result) => {
    console.log('create_notification completed:', result);
  });
  
notificationQueue.on('failed', (job, err) => {
    console.log('create_notification failed:', err.message);
});

module.exports = notificationQueue;