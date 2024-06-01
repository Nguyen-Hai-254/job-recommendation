import applicationExpiredUpdaterQueue from '../queues/application_expired_updater.queue';

applicationExpiredUpdaterQueue.add(
    "application-expired-updater", 
    {} ,
    {
        repeat: { 
            cron: "30 0 * * *",
            tz: 'Asia/Ho_Chi_Minh' // múi giờ Việt Nam (UTC+7)
        }
    }
)

