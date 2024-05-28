"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const attachedDocumentViewSync_queue_1 = __importDefault(require("../queues/attachedDocumentViewSync.queue"));
attachedDocumentViewSync_queue_1.default.add("attached-document-view-sync", {}, {
    repeat: {
        cron: "30 */2 * * *",
        tz: 'Asia/Ho_Chi_Minh' // múi giờ Việt Nam (UTC+7)
    }
});
attachedDocumentViewSync_queue_1.default.add("attached-document-view-sync-and-delete", {}, {
    repeat: {
        cron: "30 1 * * *",
        tz: 'Asia/Ho_Chi_Minh' // múi giờ Việt Nam (UTC+7)
    }
});
//# sourceMappingURL=attachedDocumentViewSync.cron.js.map