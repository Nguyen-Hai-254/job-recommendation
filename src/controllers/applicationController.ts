import ApplicationServices from "../services/applicationServices";

export default class ApplicationController {
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

    static getApplicationsbyUser = async (req, res) => {
        try {
            const applications = await ApplicationServices.handleGetApplicationsbyUser(req);
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

    static updateApprovalStatus = async (req, res) => {
        try {
            const application = await ApplicationServices.handleUpdateApprovalStatus(req);
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
}