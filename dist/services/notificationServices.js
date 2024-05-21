"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const connectDB_1 = require("../config/connectDB");
const entities_1 = require("../entities");
const enum_1 = require("../utils/enum");
const httpException_1 = require("../exceptions/httpException");
const notificationRepository = connectDB_1.myDataSource.getRepository(entities_1.Notification);
class NotificationServices {
}
_a = NotificationServices;
NotificationServices.handleCreateNewNotification = async (userId, content) => {
    try {
        const notification = notificationRepository.create({
            content: content,
            user: { userId: userId }
        });
        await notificationRepository.save(notification);
    }
    catch (err) {
        if (err.code === enum_1.MySQLErrorCode.INVALID_RELATION_KEY || err.code === enum_1.MySQLErrorCode.INVALID_RELATION_KEY2) {
            throw new httpException_1.HttpException(404, 'User not found');
        }
        throw err;
    }
};
exports.default = NotificationServices;
//# sourceMappingURL=notificationServices.js.map