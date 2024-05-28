import Queue from 'bull';
import { RedisOpts, JobOpts } from '../../config'
import redisClient from '../../config/redis'
import { AttachedDocument } from "../../entities"
import { myDataSource } from "../../config/connectDB"

const attached_documentRepository = myDataSource.getRepository(AttachedDocument);

const attachedDocumentViewSyncQueue = new Queue('attached-document-view-sync', { redis: RedisOpts, defaultJobOptions: {...JobOpts, priority: 1, attempts: 3 } });

attachedDocumentViewSyncQueue.process('attached-document-view-sync', async (payload, done) => {
    try {
        const views = await redisClient.HGETALL('attached-document-views');
        await attached_documentRepository.manager.transaction(async (manager) => {
            const updatePromises = Object.entries(views).map(([userId, view]) =>
                manager.update(AttachedDocument, { userId: userId }, { view: parseInt(view, 10) })
            );
            await Promise.all(updatePromises);
        });
        done()
    } catch (err) {
        done(err);
    }
});

attachedDocumentViewSyncQueue.process('attached-document-view-sync-and-delete', async (payload, done) => {
    try {
        const views = await redisClient.HGETALL('attached-document-views');
        await attached_documentRepository.manager.transaction(async (manager) => {
            const updatePromises = Object.entries(views).map(([userId, view]) =>
                manager.update(AttachedDocument, { userId: userId }, { view: parseInt(view, 10) })
            );
            await Promise.all(updatePromises);
        });
        await redisClient.del('attached-document-views');
        done()
    } catch (err) {
        done(err);
    }
});

attachedDocumentViewSyncQueue.on('active', (job, jobPromise) => {
    console.log('attached document view sync started'); 
});
  
attachedDocumentViewSyncQueue.on('completed', (job, result) => {
    console.log('attached document view sync completed:', result);
  });
  
attachedDocumentViewSyncQueue.on('failed', (job, err) => {
    console.log('attached document view sync failed:', err.message);
});

export default attachedDocumentViewSyncQueue;