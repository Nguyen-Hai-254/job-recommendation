import { HttpException } from "../exceptions/httpException";
import ApplicationServices from "../services/applicationServices";
import respondSuccess from "../utils/respondSuccess";
const notificationQueue = require('../workers/queues/notification.queue');
const mailQueue = require('../workers/queues/mail.queue')

import { myDataSource } from "../config/connectDB"
import { Notification } from "../entities"
const notificationRepository = myDataSource.getRepository(Notification);

export default class ApplicationController {
    static getApplicationsbyEmployee = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const applications = await ApplicationServices.handleGetApplicationsbyEmployee(userId, req.query);
            return respondSuccess(res, 'get my applications successfully', applications);
        } catch (error) {
            next(error);
        }
    }

    static getApplication = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'Invalid id')
            const application = await ApplicationServices.handleGetApplication(id);
            return respondSuccess(res, 'get my application successfully', application);
        } catch (error) {
            next(error);
        }
    }

    static createNewApplication = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const application = await ApplicationServices.handleCreateNewApplication(userId, req.body);
            const message = 'Bạn đã tạo và nộp đơn ứng tuyển thành công';
            
            const notification = notificationRepository.create({
                user: req.user,
                title: 'application', 
                content: message
            })
            await notificationQueue.add(notification)

            return respondSuccess(res, message, application, 201);
        } catch (error) {
            next(error);
        }
    }

    static getApplicationsbyEmployer = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const applications = await ApplicationServices.handleGetApplicationsbyEmployer(userId, req.query);
            return respondSuccess(res, 'get applications by employer successfully', applications);
        } catch (error) {
            next(error);
        }
    }

    static getApplicationbyEmployer = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'Invalid id');
            const application = await ApplicationServices.handleGetApplicationbyEmployer(userId, id);
            return respondSuccess(res, 'get application by employer successfully', application);
        } catch (error) {
            next(error);
        }
    }

    static updateApplicationbyEmployer = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'Invalid id');
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const application = await ApplicationServices.handleUpdateApplicationbyEmployer(userId, id, req.body);
            const message = 'Bạn đã cập nhật trạng thái đơn ứng tuyển thành công';
            
            const notification = notificationRepository.create({
                user: req.user,
                title: 'application', 
                content: message
            })
            await notificationQueue.add(notification)

            // send information to employee
            if (req.body?.status) { 
                // create a notification
                const notificationToEmployee = notificationRepository.create({
                    user: { userId: application.employee.userId },
                    title: 'application',
                    content: `Đơn ứng tuyển của bạn tại tin đăng: ${application.jobTitle} đã được cập nhật thành ${application.status}`
                })
                await notificationQueue.add(notificationToEmployee)
                // send mail
                await mailQueue.add({
                    emails: application.email,
                    subject: `${application.companyName}: Trạng thái mới đơn ứng tuyển của bạn tại tin đăng: ${application.jobTitle}`,
                    html: `<p>Đơn ứng tuyển của bạn đã được cập nhật trạng thái thành <b>${application.status}</b></p>`,
                });
            }

            return respondSuccess(res, message, application);
        } catch (error) {
            next(error);
        }
    }

    static getApplicationsByAdmin = async (req, res, next) => {
        try {
            const applications = await ApplicationServices.handleGetApplicationsByAdmin(req.query);
            return respondSuccess(res, 'get applications by admin successfully', applications);
        } catch (error) {
            next(error);
        }
    }

    static getCheckApplied = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { postId } = req.params;
            if (!postId) throw new HttpException(400, 'Invalid post id provided') 
            const applications = await ApplicationServices.check_applied(userId, postId)
            return respondSuccess(res, 'get check appplied successfully', applications);
        } catch (error) {
            next(error);
        }
    }

}