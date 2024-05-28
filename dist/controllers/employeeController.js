"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const httpException_1 = require("../exceptions/httpException");
const employeeServices_1 = __importDefault(require("../services/employeeServices"));
const respondSuccess_1 = __importDefault(require("../utils/respondSuccess"));
const notificationQueue = require('../workers/queues/notification.queue');
const connectDB_1 = require("../config/connectDB");
const entities_1 = require("../entities");
const notificationRepository = connectDB_1.myDataSource.getRepository(entities_1.Notification);
class EmployeeController {
}
_a = EmployeeController;
EmployeeController.getAttachedDocument = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const attached_document = await employeeServices_1.default.handleGetAttachedDocument(userId);
        return (0, respondSuccess_1.default)(res, 'get my attached document successfully', attached_document);
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.createNewAttachedDocument = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const attached_document = await employeeServices_1.default.handleCreateNewAttachedDocument(userId, req.body);
        const message = 'Bạn đã tạo hồ sơ đính kèm';
        const notification = notificationRepository.create({
            user: req.user,
            title: 'attached document',
            content: message
        });
        await notificationQueue.add(notification);
        return (0, respondSuccess_1.default)(res, message, attached_document, 201);
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.updateAttachedDocument = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const attached_document = await employeeServices_1.default.handleUpdateAttachedDocument(userId, req.body);
        const message = 'Bạn đã cập nhật hồ sơ đính kèm';
        const notification = notificationRepository.create({
            user: req.user,
            title: 'attached document',
            content: message
        });
        await notificationQueue.add(notification);
        return (0, respondSuccess_1.default)(res, message, attached_document);
    }
    catch (error) {
        next(error);
    }
};
// Admin
EmployeeController.deleteAttachedDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'id is required');
        const attached_document = await employeeServices_1.default.handleDeleteAttachedDocument(id);
        return (0, respondSuccess_1.default)(res, 'remove attached document successfully', attached_document);
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.getOnlineProfile = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const online_profile = await employeeServices_1.default.handleGetOnlineProfile(userId);
        return (0, respondSuccess_1.default)(res, 'get my online profile successfully', online_profile);
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.createNewOnlineProfile = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const online_profile = await employeeServices_1.default.handleCreateNewOnlineProfile(userId, req.body);
        const message = 'Bạn đã tạo hồ sơ trực tuyến';
        const notification = notificationRepository.create({
            user: req.user,
            title: 'online profile',
            content: message
        });
        await notificationQueue.add(notification);
        return (0, respondSuccess_1.default)(res, message, online_profile, 201);
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.updateOnlineProfile = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const online_profile = await employeeServices_1.default.handleUpdateOnlineProfile(userId, req.body);
        const message = 'Bạn đã cập nhật hồ sơ trực tuyến';
        const notification = notificationRepository.create({
            user: req.user,
            title: 'online profile',
            content: message
        });
        await notificationQueue.add(notification);
        return (0, respondSuccess_1.default)(res, message, online_profile);
    }
    catch (error) {
        next(error);
    }
};
// admin
EmployeeController.deleteOnlineProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'id is required');
        const online_profile = await employeeServices_1.default.handleDeleteOnlineProfile(id);
        return (0, respondSuccess_1.default)(res, 'remove online profile successfully', online_profile);
    }
    catch (error) {
        next(error);
    }
};
// online profile : another degree, education information, work experience
// 1. another degree
EmployeeController.createNewAnotherDegree = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const another_degree = await employeeServices_1.default.handleCreateNewAnotherDegree(userId, req.body);
        return (0, respondSuccess_1.default)(res, 'Create new another degree successfully', another_degree, 201);
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.updateAnotherDegree = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const another_degree = await employeeServices_1.default.handleUpdateAnotherDegree(userId, id, req.body);
        return (0, respondSuccess_1.default)(res, 'Updated degree successfully', another_degree);
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.deleteAnotherDegree = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        const another_degree = await employeeServices_1.default.handleDeleteAnotherDegree(userId, id);
        return (0, respondSuccess_1.default)(res, 'Delete degree successfully', another_degree);
    }
    catch (error) {
        next(error);
    }
};
// 2. education information
EmployeeController.createNewEducationInformation = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const education_information = await employeeServices_1.default.handleCreateNewEducationInformation(userId, req.body);
        return (0, respondSuccess_1.default)(res, 'Create new education information successfully', education_information, 201);
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.updateEducationInformation = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const education_information = await employeeServices_1.default.handleUpdateEducationInformation(userId, id, req.body);
        return (0, respondSuccess_1.default)(res, 'Update education information successfully', education_information);
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.deleteEducationInformation = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        const education_informations = await employeeServices_1.default.handleDeleteEducationInformation(userId, id);
        return (0, respondSuccess_1.default)(res, 'Delete education information successfully', education_informations);
    }
    catch (error) {
        next(error);
    }
};
// 3. work experience
EmployeeController.createNewWorkExperience = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const work_experience = await employeeServices_1.default.handleCreateNewWorkExperience(userId, req.body);
        return (0, respondSuccess_1.default)(res, 'Create new work experience successfully', work_experience, 201);
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.updateWorkExperience = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const workexperience = await employeeServices_1.default.handleUpdateWorkExperience(userId, id, req.body);
        return (0, respondSuccess_1.default)(res, 'Update education information successfully', workexperience);
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.deleteWorkExperience = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        const work_experience = await employeeServices_1.default.handleDeleteWorkExperience(userId, id);
        return (0, respondSuccess_1.default)(res, 'Delete work experience successfully', work_experience);
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.getEmployeesByAdmin = async (req, res, next) => {
    try {
        const employees = await employeeServices_1.default.handleGetEmployeesByAdmin(req.query);
        return (0, respondSuccess_1.default)(res, 'get employees by admin successfully', employees);
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.getEmployeesByEmployer = async (req, res, next) => {
    try {
        const employees = await employeeServices_1.default.handleGetEmployeesByEmployer(req.query);
        return (0, respondSuccess_1.default)(res, 'get employees by employer successfully', employees);
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.getEmployeeJobApplicationByEmployer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { type } = req.query;
        if (!id)
            throw new httpException_1.HttpException(400, 'id is invalid');
        if (!type)
            throw new httpException_1.HttpException(400, 'type is invalid');
        const employee = await employeeServices_1.default.handleGetEmployeeJobApplicationByEmployer(id, type);
        return (0, respondSuccess_1.default)(res, 'get employee by employer successfully', employee);
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.getEmployeesByEmployerSortByKeywords = async (req, res, next) => {
    try {
        const { keywords } = req.query;
        if (!keywords)
            throw new httpException_1.HttpException(400, 'Invalid keywords');
        const employees = await employeeServices_1.default.handleGetEmployeesByEmployerSortByKeywords(req.query);
        return (0, respondSuccess_1.default)(res, 'get employees by employer sort by keywords successfully', employees);
    }
    catch (error) {
        next(error);
    }
};
exports.default = EmployeeController;
//# sourceMappingURL=employeeController.js.map