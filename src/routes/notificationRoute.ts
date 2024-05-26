import express from "express"
import { verifyToken } from "../middlewares/auth";
import { paginationParser } from "../middlewares/paginationParser";
import NotificationController from "../controllers/notificationController";
const route = express.Router()

route.get('/user/notifications', verifyToken, paginationParser, NotificationController.getNotificationsByUser);

export default route