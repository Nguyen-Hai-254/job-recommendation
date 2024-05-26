"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const httpException_1 = require("../exceptions/httpException");
const userServices_1 = __importDefault(require("../services/userServices"));
const respondSuccess_1 = __importDefault(require("../utils/respondSuccess"));
const notificationQueue = require('../queues/notification.queue');
const connectDB_1 = require("../config/connectDB");
const entities_1 = require("../entities");
const notificationRepository = connectDB_1.myDataSource.getRepository(entities_1.Notification);
class UserController {
}
_a = UserController;
UserController.getProfile = async (req, res, next) => {
    try {
        const getUser = await userServices_1.default.handleGetProfile(req.user);
        return (0, respondSuccess_1.default)(res, 'OK', getUser);
    }
    catch (error) {
        next(error);
    }
};
UserController.editProfile = async (req, res, next) => {
    try {
        const data = await userServices_1.default.handleEditProfile(req.user, req.body);
        const message = 'Bạn đã cập nhật thông tin cá nhân';
        const notification = notificationRepository.create({
            user: req.user,
            title: 'profile',
            content: message
        });
        await notificationQueue.add(notification);
        return (0, respondSuccess_1.default)(res, message, data);
    }
    catch (error) {
        next(error);
    }
};
UserController.getInformationCompany = async (req, res, next) => {
    try {
        const getCompany = await userServices_1.default.handleGetInformationCompany(req.user);
        return (0, respondSuccess_1.default)(res, 'OK', getCompany);
    }
    catch (error) {
        next(error);
    }
};
UserController.editInformationCompany = async (req, res, next) => {
    try {
        const data = await userServices_1.default.handleEditInformationCompany(req.user, req.body);
        const message = 'Bạn đã cập nhật thông tin công ty của bạn';
        const notification = notificationRepository.create({
            user: req.user,
            title: 'company profile',
            content: message
        });
        await notificationQueue.add(notification);
        return (0, respondSuccess_1.default)(res, message, data);
    }
    catch (error) {
        next(error);
    }
};
UserController.uploadAvatar = async (req, res, next) => {
    try {
        if (!req.body.avatar)
            throw new httpException_1.HttpException(400, 'Invalid avatar');
        const data = await userServices_1.default.handleUploadAvatar(req.user, req.body.avatar);
        const message = 'Cập nhật ảnh đại diện thành công';
        const notification = notificationRepository.create({
            user: req.user,
            title: 'profile',
            content: message
        });
        await notificationQueue.add(notification);
        return (0, respondSuccess_1.default)(res, message, data);
    }
    catch (error) {
        next(error);
    }
};
UserController.uploadLogo = async (req, res, next) => {
    try {
        if (!req.body.logo)
            throw new httpException_1.HttpException(400, 'Invalid logo');
        const data = await userServices_1.default.handleUploadLogo(req.user, req.body.logo);
        const message = 'Cập nhật logo công ty thành công';
        const notification = notificationRepository.create({
            user: req.user,
            title: 'company profile',
            content: message
        });
        await notificationQueue.add(notification);
        return (0, respondSuccess_1.default)(res, message, data);
    }
    catch (error) {
        next(error);
    }
};
UserController.uploadBanner = async (req, res, next) => {
    try {
        if (!req.body.banner)
            throw new httpException_1.HttpException(400, 'Invalid banner');
        const data = await userServices_1.default.handleUploadBanner(req.user, req.body.banner);
        const message = 'Cập nhật banner công ty thành công';
        const notification = notificationRepository.create({
            user: req.user,
            title: 'company profile',
            content: message
        });
        await notificationQueue.add(notification);
        return (0, respondSuccess_1.default)(res, message, data);
    }
    catch (error) {
        next(error);
    }
};
UserController.getInformationCompanyByUser = async (req, res, next) => {
    try {
        if (!req.query.employerId)
            throw new httpException_1.HttpException(400, 'Invalid cemployerId');
        const company = await userServices_1.default.handleGetInformationCompanyByUser(req.query.employerId);
        return (0, respondSuccess_1.default)(res, 'OK', company);
    }
    catch (error) {
        next(error);
    }
};
UserController.getAllCompanyByUser = async (req, res, next) => {
    try {
        const companyList = await userServices_1.default.handleGetAllCompanyByUser(req.query);
        return (0, respondSuccess_1.default)(res, 'OK', companyList);
    }
    catch (error) {
        next(error);
    }
};
UserController.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'id is required');
        const user = await userServices_1.default.handleDeleteUser(id);
        return (0, respondSuccess_1.default)(res, `Delete user has id: ${id}  successfully`, user);
    }
    catch (error) {
        next(error);
    }
};
UserController.getOnlineProfileByUser = async (req, res, next) => {
    try {
        if (!req.query.userId)
            throw new httpException_1.HttpException(400, 'query userId is required');
        const user = await userServices_1.default.handleGetOnlineProfileByUser(req.query.userId);
        return (0, respondSuccess_1.default)(res, `'Find online profile successfully'`, user);
    }
    catch (error) {
        next(error);
    }
};
UserController.getAttachedDocumentByUser = async (req, res, next) => {
    try {
        if (!req.query.userId)
            throw new httpException_1.HttpException(400, 'query userId is required');
        const user = await userServices_1.default.handleGetAttachedDocumentByUser(req.query.userId);
        return (0, respondSuccess_1.default)(res, `'Find attached document successfully'`, user);
    }
    catch (error) {
        next(error);
    }
};
exports.default = UserController;
//# sourceMappingURL=userController.js.map