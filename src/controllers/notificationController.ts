import respondSuccess from "../utils/respondSuccess";
import NotificationServices from "../services/notificationServices";

export default class NotificationController {
    static getNotificationsByUser = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const notifications = await NotificationServices.handleGetNotificationsByUser(userId, req.query);
            return respondSuccess(res, 'get your notification successfully', notifications);
        } catch (error) {
            next(error);
        }
    }
}