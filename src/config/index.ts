require('dotenv').config();

export const RedisOpts = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD 
}
export const JobOpts = {
    attempts: 1,
    priority: 1, // Optional priority value. ranges from 1 (highest priority) to MAX_INT  (lowest priority) 
    backoff: {
      type: 'fixed',
      delay: 60000 // 1p
    },
    removeOnComplete: true, 
    removeOnFail: 50
}
export const queueOptions = {
    redis: RedisOpts,
    defaultJobOptions: JobOpts
}
export const queuesList = ['mail', 'notification', 'post-view-sync', 'online-profile-view-sync', 'attached-document-view-sync', 'post-expired-updater']
export const PORT = Number(process.env.PORT)
