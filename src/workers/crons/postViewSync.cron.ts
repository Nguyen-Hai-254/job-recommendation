import postViewSyncQueue from '../queues/postViewSync.queue';

postViewSyncQueue.add(
    "post-view-sync", 
    {} ,
    {
        repeat: { 
            cron: "0 9,15 * * *",
            tz: 'Asia/Ho_Chi_Minh' // múi giờ Việt Nam (UTC+7)
        }
    }
)

postViewSyncQueue.add(
    "post-view-sync-and-delete", 
    {} ,
    {
        repeat: { 
            cron: "0 1 * * *",
            tz: 'Asia/Ho_Chi_Minh' // múi giờ Việt Nam (UTC+7)
        }
    }
)

