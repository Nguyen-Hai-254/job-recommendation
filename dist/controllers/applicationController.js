"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const httpException_1 = require("../exceptions/httpException");
const applicationServices_1 = __importDefault(require("../services/applicationServices"));
const respondSuccess_1 = __importDefault(require("../utils/respondSuccess"));
const notificationQueue = require('../workers/queues/notification.queue');
const mailQueue = require('../workers/queues/mail.queue');
const connectDB_1 = require("../config/connectDB");
const entities_1 = require("../entities");
const notificationRepository = connectDB_1.myDataSource.getRepository(entities_1.Notification);
class ApplicationController {
}
_a = ApplicationController;
ApplicationController.getApplicationsbyEmployee = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const applications = await applicationServices_1.default.handleGetApplicationsbyEmployee(userId, req.query);
        return (0, respondSuccess_1.default)(res, 'get my applications successfully', applications);
    }
    catch (error) {
        next(error);
    }
};
ApplicationController.getApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        const application = await applicationServices_1.default.handleGetApplication(id);
        return (0, respondSuccess_1.default)(res, 'get my application successfully', application);
    }
    catch (error) {
        next(error);
    }
};
ApplicationController.createNewApplication = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const application = await applicationServices_1.default.handleCreateNewApplication(userId, req.body);
        const message = 'Bạn đã tạo và nộp đơn ứng tuyển thành công';
        const notification = notificationRepository.create({
            user: req.user,
            title: 'application',
            content: message
        });
        await notificationQueue.add(notification);
        return (0, respondSuccess_1.default)(res, message, application, 201);
    }
    catch (error) {
        next(error);
    }
};
ApplicationController.getApplicationsbyEmployer = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const applications = await applicationServices_1.default.handleGetApplicationsbyEmployer(userId, req.query);
        return (0, respondSuccess_1.default)(res, 'get applications by employer successfully', applications);
    }
    catch (error) {
        next(error);
    }
};
ApplicationController.getApplicationbyEmployer = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        const application = await applicationServices_1.default.handleGetApplicationbyEmployer(userId, id);
        return (0, respondSuccess_1.default)(res, 'get application by employer successfully', application);
    }
    catch (error) {
        next(error);
    }
};
ApplicationController.updateApplicationbyEmployer = async (req, res, next) => {
    var _b;
    try {
        const { userId } = req.user;
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const application = await applicationServices_1.default.handleUpdateApplicationbyEmployer(userId, id, req.body);
        const message = 'Bạn đã cập nhật trạng thái đơn ứng tuyển thành công';
        const notification = notificationRepository.create({
            user: req.user,
            title: 'application',
            content: message
        });
        await notificationQueue.add(notification);
        // send information to employee
        if ((_b = req.body) === null || _b === void 0 ? void 0 : _b.status) {
            // create a notification
            const notificationToEmployee = notificationRepository.create({
                user: { userId: application.employee.userId },
                title: 'application',
                content: `Đơn ứng tuyển của bạn tại tin đăng: ${application.jobTitle} đã được cập nhật thành ${application.status}`
            });
            await notificationQueue.add(notificationToEmployee);
            // send mail
            await mailQueue.add({
                emails: application.email,
                subject: `${application.companyName}: Trạng thái mới đơn ứng tuyển của bạn tại tin đăng: ${application.jobTitle}`,
                html: `<p>Đơn ứng tuyển của bạn đã được cập nhật trạng thái thành <b>${application.status}</b></p>`,
            });
        }
        return (0, respondSuccess_1.default)(res, message, application);
    }
    catch (error) {
        next(error);
    }
};
ApplicationController.getApplicationsByAdmin = async (req, res, next) => {
    try {
        const applications = await applicationServices_1.default.handleGetApplicationsByAdmin(req.query);
        return (0, respondSuccess_1.default)(res, 'get applications by admin successfully', applications);
    }
    catch (error) {
        next(error);
    }
};
ApplicationController.getCheckApplied = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { postId } = req.params;
        if (!postId)
            throw new httpException_1.HttpException(400, 'Invalid post id provided');
        const applications = await applicationServices_1.default.check_applied(userId, postId);
        return (0, respondSuccess_1.default)(res, 'get check appplied successfully', applications);
    }
    catch (error) {
        next(error);
    }
};
exports.default = ApplicationController;
//# sourceMappingURL=applicationController.js.map