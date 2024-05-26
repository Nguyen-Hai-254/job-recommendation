import { HttpException } from "../exceptions/httpException";
import UserServices from "../services/userServices";
import respondSuccess from "../utils/respondSuccess";
const notificationQueue = require('../queues/notification.queue');

import { myDataSource } from "../config/connectDB"
import { Notification } from "../entities"
const notificationRepository = myDataSource.getRepository(Notification);


export default class UserController {
    static getProfile = async (req, res, next) => {
        try {
            const getUser = await UserServices.handleGetProfile(req.user);
            return respondSuccess(res, 'OK', getUser);
        } catch (error) {
            next(error);
        }
    }

    static editProfile = async (req, res, next) => {
        try {
            const data = await UserServices.handleEditProfile(req.user, req.body);
            const message = 'Bạn đã cập nhật thông tin cá nhân';

            const notification = notificationRepository.create({
                user: req.user,
                title: 'profile', 
                content: message
            })
            await notificationQueue.add(notification)

            return respondSuccess(res, message, data);
        } catch (error) {
            next(error);
        }
    }

    static getInformationCompany = async (req, res, next) => {
        try {
            const getCompany = await UserServices.handleGetInformationCompany(req.user);
            return respondSuccess(res, 'OK', getCompany);
        } catch (error) {
            next(error);
        }
    }

    static editInformationCompany = async (req, res, next) => {
        try {
            const data = await UserServices.handleEditInformationCompany(req.user, req.body);
            const message = 'Bạn đã cập nhật thông tin công ty của bạn';

            const notification = notificationRepository.create({
                user: req.user,
                title: 'company profile', 
                content: message
            })
            await notificationQueue.add(notification)

            return respondSuccess(res, message, data);
        } catch (error) {
            next(error);
        }
    }

    static uploadAvatar = async (req, res, next) => {
        try {
            if (!req.body.avatar) throw new HttpException(400, 'Invalid avatar');

            const data = await UserServices.handleUploadAvatar(req.user, req.body.avatar);
            const message = 'Cập nhật ảnh đại diện thành công';

            const notification = notificationRepository.create({
                user: req.user,
                title: 'profile', 
                content: message
            })
            await notificationQueue.add(notification)

            return respondSuccess(res, message, data);
        } catch (error) {
            next(error);
        }
    }

    static uploadLogo = async (req, res, next) => {
        try {
            if (!req.body.logo) throw new HttpException(400, 'Invalid logo');
            
            const data = await UserServices.handleUploadLogo(req.user, req.body.logo);
            const message = 'Cập nhật logo công ty thành công';

            const notification = notificationRepository.create({
                user: req.user,
                title: 'company profile', 
                content: message
            })
            await notificationQueue.add(notification)

            return respondSuccess(res, message, data);
        } catch (error) {
            next(error);
        }
    }

    static uploadBanner = async (req, res, next) => {
        try {
            if (!req.body.banner) throw new HttpException(400, 'Invalid banner');
            
            const data = await UserServices.handleUploadBanner(req.user, req.body.banner);
            const message = 'Cập nhật banner công ty thành công';
            
            const notification = notificationRepository.create({
                user: req.user,
                title: 'company profile', 
                content: message
            })
            await notificationQueue.add(notification)

            return respondSuccess(res, message, data);
        } catch (error) {
            next(error);
        }
    }

    static getInformationCompanyByUser = async (req, res, next) => {
        try {
            if (!req.query.employerId) throw new HttpException(400, 'Invalid cemployerId');

            const company = await UserServices.handleGetInformationCompanyByUser(req.query.employerId);
            return respondSuccess(res, 'OK', company);
        } catch (error) {
            next(error);
        }
    }

    static getAllCompanyByUser = async (req, res, next) => {
        try {
            const companyList = await UserServices.handleGetAllCompanyByUser(req.query);
            return respondSuccess(res, 'OK', companyList);
        } catch (error) {
            next(error);
        }
    }

    static deleteUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'id is required');

            const user = await UserServices.handleDeleteUser(id);
            return respondSuccess(res, `Delete user has id: ${id}  successfully`, user);
        } catch (error) {
            next(error);
        }
    }

    static getOnlineProfileByUser = async (req, res, next) => {
        try {
            if (!req.query.userId) throw new HttpException(400, 'query userId is required');
              
            const user = await UserServices.handleGetOnlineProfileByUser(req.query.userId);  
            return respondSuccess(res, `'Find online profile successfully'`, user);
        } catch (error) {
            next(error);
        }
    }

    static getAttachedDocumentByUser = async (req, res, next) => {
        try {
            if (!req.query.userId) throw new HttpException(400, 'query userId is required');

            const user = await UserServices.handleGetAttachedDocumentByUser(req.query.userId);
            return respondSuccess(res, `'Find attached document successfully'`, user);
        } catch (error) {
            next(error);
        }
    }
}