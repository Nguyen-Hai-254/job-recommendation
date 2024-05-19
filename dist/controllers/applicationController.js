"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const httpException_1 = require("../exceptions/httpException");
const applicationServices_1 = __importDefault(require("../services/applicationServices"));
class ApplicationController {
}
_a = ApplicationController;
ApplicationController.getApplicationsbyEmployee = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const applications = await applicationServices_1.default.handleGetApplicationsbyEmployee(userId);
        return res.status(200).json({ message: 'get my applications successfully', data: applications });
    }
    catch (error) {
        next(error);
    }
};
ApplicationController.getApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        const application = await applicationServices_1.default.handleGetApplication(id);
        return res.status(200).json({ message: 'get the application successfully', data: application });
    }
    catch (error) {
        next(error);
    }
};
ApplicationController.createNewApplication = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const application = await applicationServices_1.default.handleCreateNewApplication(userId, req.body);
        return res.status(201).json({ message: 'Create new application successfully', data: application });
    }
    catch (error) {
        next(error);
    }
};
ApplicationController.getApplicationsbyEmployer = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const applications = await applicationServices_1.default.handleGetApplicationsbyEmployer(userId, req.query);
        return res.status(200).json({ message: 'get applications by employer successfully', data: applications });
    }
    catch (error) {
        next(error);
    }
};
ApplicationController.getLengthOfApplicationsbyEmployer = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const applications = await applicationServices_1.default.handleGetLengthOfApplicationsbyEmployer(userId, req.query);
        return res.status(200).json({ message: 'get length of applications by employer successfully', data: applications });
    }
    catch (error) {
        next(error);
    }
};
ApplicationController.getApplicationbyEmployer = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        const application = await applicationServices_1.default.handleGetApplicationbyEmployer(userId, id);
        return res.status(200).json({ message: 'get application by employer successfully', data: application });
    }
    catch (error) {
        next(error);
    }
};
ApplicationController.updateApplicationbyEmployer = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const application = await applicationServices_1.default.handleUpdateApplicationbyEmployer(userId, id, req.body);
        return res.status(200).json({ message: 'update application by employer successfully', data: application });
    }
    catch (error) {
        next(error);
    }
};
ApplicationController.getAllApplications = async (req, res, next) => {
    try {
        const applications = await applicationServices_1.default.handleGetAllApplications();
        return res.status(200).json({ message: 'get applications by admin successfully', data: applications });
    }
    catch (error) {
        next(error);
    }
};
exports.default = ApplicationController;
//# sourceMappingURL=applicationController.js.map