"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_expired_updater_queue_1 = __importDefault(require("../queues/post_expired_updater.queue"));
post_expired_updater_queue_1.default.add("post-expired-updater", {}, {
    repeat: {
        cron: "0 0 * * *",
        tz: 'Asia/Ho_Chi_Minh' // múi giờ Việt Nam (UTC+7)
    }
});
//# sourceMappingURL=post_expired_updater.cron.js.map