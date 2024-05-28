import onlineProfileViewSyncQueue from '../queues/onlineProfileViewSync.queue';

onlineProfileViewSyncQueue.add(
    "online-profile-view-sync", 
    {} ,
    {
        repeat: { 
            cron: "15 */2 * * *",
            tz: 'Asia/Ho_Chi_Minh' // múi giờ Việt Nam (UTC+7)
        }
    }
)

onlineProfileViewSyncQueue.add(
    "online-profile-view-sync-and-delete", 
    {} ,
    {
        repeat: { 
            cron: "15 1 * * *",
            tz: 'Asia/Ho_Chi_Minh' // múi giờ Việt Nam (UTC+7)
        }
    }
)

