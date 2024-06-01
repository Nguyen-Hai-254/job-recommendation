"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const application_expired_updater_queue_1 = __importDefault(require("../queues/application_expired_updater.queue"));
application_expired_updater_queue_1.default.add("application-expired-updater", {}, {
    repeat: {
        cron: "30 0 * * *",
        tz: 'Asia/Ho_Chi_Minh' // múi giờ Việt Nam (UTC+7)
    }
});
//# sourceMappingURL=application_expired_updater.cron.js.map