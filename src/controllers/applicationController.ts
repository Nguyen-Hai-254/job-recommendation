import { HttpException } from "../exceptions/httpException";
import ApplicationServices from "../services/applicationServices";

export default class ApplicationController {
    static getApplicationsbyEmployee = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const applications = await ApplicationServices.handleGetApplicationsbyEmployee(userId);
            return res.status(200).json({ message: 'get my applications successfully', applications});
        } catch (error) {
            next(error);
        }
    }

    static getApplication = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'Invalid id')
            const application = await ApplicationServices.handleGetApplication(id);
            return res.status(200).json({ message: 'get the application successfully', application});
        } catch (error) {
            next(error);
        }
    }

    static createNewApplication = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const application = await ApplicationServices.handleCreateNewApplication(userId, req.body);
            return res.status(201).json({message: 'Create new application successfully', data: application});
        } catch (error) {
            next(error);
        }
    }

    static getApplicationsbyEmployer = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const applications = await ApplicationServices.handleGetApplicationsbyEmployer(userId, req.query);
            return res.status(200).json({message: 'get applications by employer successfully', data: applications});
        } catch (error) {
            next(error);
        }
    }

    static getLengthOfApplicationsbyEmployer = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const applications = await ApplicationServices.handleGetLengthOfApplicationsbyEmployer(userId, req.query);
            return res.status(200).json({message: 'get length of applications by employer successfully', data: applications});
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
            return res.status(200).json({message: 'get application by employer successfully', data: application});
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
            return res.status(200).json({message: 'update application by employer successfully', data: application});
        } catch (error) {
            next(error);
        }
    }

    static getAllApplications = async (req, res, next) => {
        try {
            const applications = await ApplicationServices.handleGetAllApplications();
            return res.status(200).json({message: 'get applications by admin successfully', data: applications});
        } catch (error) {
            next(error);
        }
    }
}