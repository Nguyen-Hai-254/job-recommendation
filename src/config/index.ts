require('dotenv').config();

export const queueOptions = {
    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD 
    },
    defaultJobOptions: {
        attempts: 1,
        backoff: {
          type: 'fixed',
          delay: 60000 // 1h
        },
        removeOnComplete: true, 
        removeOnFail: 50
    }
}

export const queuesList = ['mail', 'notification']
export const PORT = Number(process.env.PORT)
