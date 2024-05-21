import { HttpException } from "../exceptions/httpException";
import ApplicationServices from "../services/applicationServices";
import respondSuccess from "../utils/respondSuccess";

export default class ApplicationController {
    static getApplicationsbyEmployee = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const applications = await ApplicationServices.handleGetApplicationsbyEmployee(userId);
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
            return respondSuccess(res, 'Create new application successfully', application, 201);
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

    static getLengthOfApplicationsbyEmployer = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const applications = await ApplicationServices.handleGetLengthOfApplicationsbyEmployer(userId, req.query);
            return respondSuccess(res, 'get length of applications by employer successfully', applications);
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
            return respondSuccess(res, 'update application by employer successfully', application);
        } catch (error) {
            next(error);
        }
    }

    static getAllApplications = async (req, res, next) => {
        try {
            const applications = await ApplicationServices.handleGetAllApplications();
            return respondSuccess(res, 'get applications by admin successfully', applications);
        } catch (error) {
            next(error);
        }
    }
}