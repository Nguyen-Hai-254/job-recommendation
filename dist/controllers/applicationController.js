"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const applicationServices_1 = __importDefault(require("../services/applicationServices"));
class ApplicationController {
}
_a = ApplicationController;
ApplicationController.getApplicationsbyEmployee = async (req, res) => {
    try {
        const applications = await applicationServices_1.default.handleGetApplicationsbyEmployee(req);
        return res.status(applications.status).json({
            message: applications.message,
            status: 200,
            data: applications.data ? applications.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
ApplicationController.getApplication = async (req, res) => {
    try {
        const application = await applicationServices_1.default.handleGetApplication(req);
        return res.status(application.status).json({
            message: application.message,
            status: application.status,
            data: application.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
ApplicationController.createNewApplication = async (req, res) => {
    try {
        const application = await applicationServices_1.default.handleCreateNewApplication(req);
        return res.status(application.status).json({
            message: application.message,
            status: application.status,
            data: application.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
ApplicationController.getApplicationsbyEmployer = async (req, res) => {
    try {
        const applications = await applicationServices_1.default.handleGetApplicationsbyEmployer(req);
        return res.status(applications.status).json({
            message: applications.message,
            status: 200,
            data: applications.data ? applications.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
ApplicationController.getLengthOfApplicationsbyEmployer = async (req, res) => {
    try {
        const applications = await applicationServices_1.default.handleGetLengthOfApplicationsbyEmployer(req);
        return res.status(applications.status).json({
            message: applications.message,
            status: 200,
            data: applications.data ? applications.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
ApplicationController.getApplicationbyEmployer = async (req, res) => {
    try {
        const applications = await applicationServices_1.default.handleGetApplicationbyEmployer(req);
        return res.status(applications.status).json({
            message: applications.message,
            status: 200,
            data: applications.data ? applications.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
ApplicationController.updateApplicationbyEmployer = async (req, res) => {
    try {
        const application = await applicationServices_1.default.handleUpdateApplicationbyEmployer(req);
        return res.status(application.status).json({
            message: application.message,
            status: application.status,
            data: application.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
ApplicationController.getAllApplications = async (req, res) => {
    try {
        const applications = await applicationServices_1.default.handleGetAllApplications();
        return res.status(applications.status).json({
            message: applications.message,
            status: applications.status,
            data: applications.data ? applications.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
exports.default = ApplicationController;
//# sourceMappingURL=applicationController.js.map