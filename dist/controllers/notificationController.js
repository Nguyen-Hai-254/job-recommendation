"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const respondSuccess_1 = __importDefault(require("../utils/respondSuccess"));
const notificationServices_1 = __importDefault(require("../services/notificationServices"));
class NotificationController {
}
_a = NotificationController;
NotificationController.getNotificationsByUser = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const notifications = await notificationServices_1.default.handleGetNotificationsByUser(userId, req.query);
        return (0, respondSuccess_1.default)(res, 'get your notification successfully', notifications);
    }
    catch (error) {
        next(error);
    }
};
exports.default = NotificationController;
//# sourceMappingURL=notificationController.js.map