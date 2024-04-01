import ApplicationServices from "../services/applicationServices";

export default class ApplicationController {
    static getApplicationsbyEmployee = async (req, res) => {
        try {
            const applications = await ApplicationServices.handleGetApplicationsbyEmployee(req);
            return res.status(applications.status).json({
                message: applications.message,
                status: 200,
                data: applications.data ? applications.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getApplication = async (req, res) => {
        try {
            const application = await ApplicationServices.handleGetApplication(req);
            return res.status(application.status).json({
                message: application.message,
                status: application.status,
                data: application.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static createNewApplication = async (req, res) => {
        try {
            const application = await ApplicationServices.handleCreateNewApplication(req);
            return res.status(application.status).json({
                message: application.message,
                status: application.status,
                data: application.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getApplicationsbyEmployer = async (req, res) => {
        try {
            const applications = await ApplicationServices.handleGetApplicationsbyEmployer(req);
            return res.status(applications.status).json({
                message: applications.message,
                status: 200,
                data: applications.data ? applications.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getLengthOfApplicationsbyEmployer = async (req, res) => {
        try {
            const applications = await ApplicationServices.handleGetLengthOfApplicationsbyEmployer(req);
            return res.status(applications.status).json({
                message: applications.message,
                status: 200,
                data: applications.data ? applications.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getApplicationbyEmployer = async (req, res) => {
        try {
            const applications = await ApplicationServices.handleGetApplicationbyEmployer(req);
            return res.status(applications.status).json({
                message: applications.message,
                status: 200,
                data: applications.data ? applications.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static updateApplicationbyEmployer = async (req, res) => {
        try {
            const application = await ApplicationServices.handleUpdateApplicationbyEmployer(req);
            return res.status(application.status).json({
                message: application.message,
                status: application.status,
                data: application.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getAllApplications = async (req, res) => {
        try {
            const applications = await ApplicationServices.handleGetAllApplications();
            return res.status(applications.status).json({
                message: applications.message,
                status: applications.status,
                data: applications.data ? applications.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }
}