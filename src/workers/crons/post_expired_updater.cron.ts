import postExpiredUpdaterQueue from '../queues/post_expired_updater.queue';

postExpiredUpdaterQueue.add(
    "post-expired-updater", 
    {} ,
    {
        repeat: { 
            cron: "0 0 * * *",
            tz: 'Asia/Ho_Chi_Minh' // múi giờ Việt Nam (UTC+7)
        }
    }
)

