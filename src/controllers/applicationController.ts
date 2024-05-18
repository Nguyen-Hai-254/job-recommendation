import ApplicationServices from "../services/applicationServices";

export default class ApplicationController {
    static getApplicationsbyEmployee = async (req, res, next) => {
        try {
            const applications = await ApplicationServices.handleGetApplicationsbyEmployee(req);
            return res.status(applications.status).json({
                message: applications.message,
                status: 200,
                data: applications.data ? applications.data : []
            });
        } catch (error) {
            next(error);
        }
    }

    static getApplication = async (req, res, next) => {
        try {
            const application = await ApplicationServices.handleGetApplication(req);
            return res.status(application.status).json({
                message: application.message,
                status: application.status,
                data: application.data
            })
        } catch (error) {
            next(error);
        }
    }

    static createNewApplication = async (req, res, next) => {
        try {
            const application = await ApplicationServices.handleCreateNewApplication(req);
            return res.status(application.status).json({
                message: application.message,
                status: application.status,
                data: application.data
            })
        } catch (error) {
            next(error);
        }
    }

    static getApplicationsbyEmployer = async (req, res, next) => {
        try {
            const applications = await ApplicationServices.handleGetApplicationsbyEmployer(req);
            return res.status(applications.status).json({
                message: applications.message,
                status: 200,
                data: applications.data ? applications.data : []
            });
        } catch (error) {
            next(error);
        }
    }

    static getLengthOfApplicationsbyEmployer = async (req, res, next) => {
        try {
            const applications = await ApplicationServices.handleGetLengthOfApplicationsbyEmployer(req);
            return res.status(applications.status).json({
                message: applications.message,
                status: 200,
                data: applications.data ? applications.data : []
            });
        } catch (error) {
            next(error);
        }
    }

    static getApplicationbyEmployer = async (req, res, next) => {
        try {
            const applications = await ApplicationServices.handleGetApplicationbyEmployer(req);
            return res.status(applications.status).json({
                message: applications.message,
                status: 200,
                data: applications.data ? applications.data : []
            });
        } catch (error) {
            next(error);
        }
    }

    static updateApplicationbyEmployer = async (req, res, next) => {
        try {
            const application = await ApplicationServices.handleUpdateApplicationbyEmployer(req);
            return res.status(application.status).json({
                message: application.message,
                status: application.status,
                data: application.data
            })
        } catch (error) {
            next(error);
        }
    }

    static getAllApplications = async (req, res, next) => {
        try {
            const applications = await ApplicationServices.handleGetAllApplications();
            return res.status(applications.status).json({
                message: applications.message,
                status: applications.status,
                data: applications.data ? applications.data : []
            });
        } catch (error) {
            next(error);
        }
    }
}