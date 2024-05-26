import { HttpException } from "../exceptions/httpException";
import EmployeeServices from "../services/employeeServices";
import respondSuccess from "../utils/respondSuccess";
const notificationQueue = require('../queues/notification.queue');

import { myDataSource } from "../config/connectDB"
import { Notification } from "../entities"
const notificationRepository = myDataSource.getRepository(Notification);

export default class EmployeeController {
    static getAttachedDocument = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const attached_document = await EmployeeServices.handleGetAttachedDocument(userId);
            return respondSuccess(res, 'get my attached document successfully', attached_document)
        } catch (error) {
            next(error);
        }
    }

    static createNewAttachedDocument = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!req.body) throw new HttpException(400, 'Invalid body')
            const attached_document = await EmployeeServices.handleCreateNewAttachedDocument(userId, req.body);
            const message = 'Bạn đã tạo hồ sơ đính kèm';
            
            const notification = notificationRepository.create({
                user: req.user,
                title: 'attached document', 
                content: message
            })
            await notificationQueue.add(notification)

            return respondSuccess(res, message, attached_document, 201)
        } catch (error) {
            next(error);
        }
    }

    static updateAttachedDocument = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!req.body) throw new HttpException(400, 'Invalid body')
            const attached_document = await EmployeeServices.handleUpdateAttachedDocument(userId, req.body);
            const message = 'Bạn đã cập nhật hồ sơ đính kèm';

            const notification = notificationRepository.create({
                user: req.user,
                title: 'attached document', 
                content: message
            })
            await notificationQueue.add(notification)

            return respondSuccess(res, message, attached_document)
        } catch (error) {
            next(error);
        }
    }
    // Admin
    static deleteAttachedDocument = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'id is required');
            const attached_document = await EmployeeServices.handleDeleteAttachedDocument(id);
            return respondSuccess(res, 'remove attached document successfully', attached_document)
        } catch (error) {
            next(error);
        }
    }

    static getOnlineProfile = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const online_profile = await EmployeeServices.handleGetOnlineProfile(userId);
            return respondSuccess(res, 'get my online profile successfully', online_profile)
        } catch (error) {
            next(error);
        }
    }

    static createNewOnlineProfile = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const online_profile = await EmployeeServices.handleCreateNewOnlineProfile(userId, req.body);
            const message = 'Bạn đã tạo hồ sơ trực tuyến';

            const notification = notificationRepository.create({
                user: req.user,
                title: 'online profile', 
                content: message
            })
            await notificationQueue.add(notification)

            return respondSuccess(res, message, online_profile, 201);
        } catch (error) {
            next(error);
        }
    }

    static updateOnlineProfile = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const online_profile = await EmployeeServices.handleUpdateOnlineProfile(userId, req.body);
            const message = 'Bạn đã cập nhật hồ sơ trực tuyến';

            const notification = notificationRepository.create({
                user: req.user,
                title: 'online profile', 
                content: message
            })
            await notificationQueue.add(notification)

            return respondSuccess(res, message, online_profile);
        } catch (error) {
            next(error);
        }
    }

    // admin
    static deleteOnlineProfile = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'id is required');
            const online_profile = await EmployeeServices.handleDeleteOnlineProfile(id);
            return respondSuccess(res, 'remove online profile successfully', online_profile)
        } catch (error) {
            next(error);
        }
    }

    // online profile : another degree, education information, work experience
    // 1. another degree
    static createNewAnotherDegree = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const another_degree = await EmployeeServices.handleCreateNewAnotherDegree(userId, req.body);
            return respondSuccess(res, 'Create new another degree successfully', another_degree, 201)
        } catch (error) {
            next(error);
        }
    }

    static updateAnotherDegree = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'Invalid id');
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const another_degree = await EmployeeServices.handleUpdateAnotherDegree(userId, id, req.body);
            return respondSuccess(res, 'Updated degree successfully', another_degree);
        } catch (error) {
            next(error);
        }
    }

    static deleteAnotherDegree = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'Invalid id');
            const another_degree = await EmployeeServices.handleDeleteAnotherDegree(userId, id);
            return respondSuccess(res, 'Delete degree successfully', another_degree);
        } catch (error) {
            next(error);
        }
    }

    // 2. education information
    static createNewEducationInformation = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const education_information = await EmployeeServices.handleCreateNewEducationInformation(userId, req.body);
            return respondSuccess(res, 'Create new education information successfully', education_information, 201)
        } catch (error) {
            next(error);
        }
    }

    static updateEducationInformation = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'Invalid id');
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const education_information = await EmployeeServices.handleUpdateEducationInformation(userId, id, req.body);
            return respondSuccess(res, 'Update education information successfully', education_information)
        } catch (error) {
            next(error);
        }
    }

    static deleteEducationInformation = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'Invalid id');
            const education_informations = await EmployeeServices.handleDeleteEducationInformation(userId, id);
            return respondSuccess(res, 'Delete education information successfully', education_informations);
        } catch (error) {
            next(error);
        }
    }

    // 3. work experience
    static createNewWorkExperience = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const work_experience = await EmployeeServices.handleCreateNewWorkExperience(userId, req.body);
            return respondSuccess(res, 'Create new work experience successfully', work_experience, 201)
        } catch (error) {
            next(error);
        }
    }

    static updateWorkExperience = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'Invalid id');
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const workexperience = await EmployeeServices.handleUpdateWorkExperience(userId, id, req.body);
            return respondSuccess(res, 'Update education information successfully', workexperience)
        } catch (error) {
            next(error);
        }
    }

    static deleteWorkExperience = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'Invalid id');
            const work_experience = await EmployeeServices.handleDeleteWorkExperience(userId, id);
            return respondSuccess(res, 'Delete work experience successfully', work_experience );
        } catch (error) {
            next(error);
        }
    }

    static getEmployeesByAdmin = async (req, res, next) => {
        try {
            const employees = await EmployeeServices.handleGetEmployeesByAdmin(req.query);
            return respondSuccess(res, 'get employees by admin successfully', employees);
        } catch (error) {
            next(error);
        }
    }

    static getEmployeesByEmployer = async (req, res, next) => {
        try {
            const employees = await EmployeeServices.handleGetEmployeesByEmployer(req.query);
            return respondSuccess(res, 'get employees by employer successfully', employees);
        } catch (error) {
            next(error);
        }
    }

   
    static getEmployeesByEmployerSortByKeywords = async (req, res, next) => {
        try {
            const { keywords } = req.query;
            if (!keywords) throw new HttpException(400, 'Invalid keywords');

            const employees = await EmployeeServices.handleGetEmployeesByEmployerSortByKeywords(req.query);
            return respondSuccess(res, 'get employees by employer sort by keywords successfully', employees)
        } catch (error) {
            next(error);
        }
    }

}