import attachedDocumentViewSyncQueue from '../queues/attachedDocumentViewSync.queue';

attachedDocumentViewSyncQueue.add(
    "attached-document-view-sync", 
    {} ,
    {
        repeat: { 
            cron: "30 */2 * * *",
            tz: 'Asia/Ho_Chi_Minh' // múi giờ Việt Nam (UTC+7)
        }
    }
)

attachedDocumentViewSyncQueue.add(
    "attached-document-view-sync-and-delete", 
    {} ,
    {
        repeat: { 
            cron: "30 1 * * *",
            tz: 'Asia/Ho_Chi_Minh' // múi giờ Việt Nam (UTC+7)
        }
    }
)

