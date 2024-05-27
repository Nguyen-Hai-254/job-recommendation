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
NotificationServices.handleCreateNewNotification = async (userId, title, content) => {
    try {
        const notification = notificationRepository.create({
            content: content,
            title: title,
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
NotificationServices.handleGetNotificationsByUser = async (userId, reqQuery) => {
    const { num, page } = reqQuery;
    let query = notificationRepository
        .createQueryBuilder('notification')
        .leftJoin('notification.user', 'user')
        .where('user.userId = :userId', { userId: userId })
        .orderBy('notification.dateAndTime', 'DESC');
    // Pagination
    query = query.skip((Number(page) - 1) * Number(num)).take(Number(num));
    const [items, totalItems] = await query.getManyAndCount();
    const totalPages = Math.ceil(totalItems / num);
    return {
        items: items,
        meta: {
            totalItems,
            itemCount: items.length,
            itemsPerPage: num,
            totalPages,
            currentPage: page
        }
    };
};
NotificationServices.saveNotification = async (notification) => {
    try {
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