"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const onlineProfileViewSync_queue_1 = __importDefault(require("../queues/onlineProfileViewSync.queue"));
onlineProfileViewSync_queue_1.default.add("online-profile-view-sync", {}, {
    repeat: {
        cron: "15 */2 * * *",
        tz: 'Asia/Ho_Chi_Minh' // múi giờ Việt Nam (UTC+7)
    }
});
onlineProfileViewSync_queue_1.default.add("online-profile-view-sync-and-delete", {}, {
    repeat: {
        cron: "15 1 * * *",
        tz: 'Asia/Ho_Chi_Minh' // múi giờ Việt Nam (UTC+7)
    }
});
//# sourceMappingURL=onlineProfileViewSync.cron.js.map