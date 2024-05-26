import { myDataSource } from "../config/connectDB"
import { Notification } from "../entities"
import { MySQLErrorCode } from "../utils/enum";
import { HttpException } from "../exceptions/httpException";

const notificationRepository = myDataSource.getRepository(Notification);

export default class NotificationServices {
    static handleCreateNewNotification = async (userId, title, content) => {
        try {
            const notification = notificationRepository.create({
                content: content,
                title: title,
                user: { userId: userId }
            })
            await notificationRepository.save(notification);
        } catch (err) {
            if (err.code === MySQLErrorCode.INVALID_RELATION_KEY || err.code === MySQLErrorCode.INVALID_RELATION_KEY2) {
                throw new HttpException(404, 'User not found')
            }
            throw err;
        }
    }
    static saveNotification = async (notification: Notification) => {
        try {
            await notificationRepository.save(notification);
        } catch (err) {
            if (err.code === MySQLErrorCode.INVALID_RELATION_KEY || err.code === MySQLErrorCode.INVALID_RELATION_KEY2) {
                throw new HttpException(404, 'User not found')
            }
            throw err;
        }
    }
}