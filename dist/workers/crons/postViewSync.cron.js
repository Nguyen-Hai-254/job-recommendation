"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postViewSync_queue_1 = __importDefault(require("../queues/postViewSync.queue"));
postViewSync_queue_1.default.add("post-view-sync", {}, {
    repeat: {
        cron: "0 9,15 * * *",
        tz: 'Asia/Ho_Chi_Minh' // múi giờ Việt Nam (UTC+7)
    }
});
postViewSync_queue_1.default.add("post-view-sync-and-delete", {}, {
    repeat: {
        cron: "0 1 * * *",
        tz: 'Asia/Ho_Chi_Minh' // múi giờ Việt Nam (UTC+7)
    }
});
//# sourceMappingURL=postViewSync.cron.js.map