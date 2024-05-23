"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const httpException_1 = require("../exceptions/httpException");
const applicationServices_1 = __importDefault(require("../services/applicationServices"));
const respondSuccess_1 = __importDefault(require("../utils/respondSuccess"));
class ApplicationController {
}
_a = ApplicationController;
ApplicationController.getApplicationsbyEmployee = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const applications = await applicationServices_1.default.handleGetApplicationsbyEmployee(userId, req.query);
        return (0, respondSuccess_1.default)(res, 'get my applications successfully', applications);
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
        return (0, respondSuccess_1.default)(res, 'get my application successfully', application);
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
        return (0, respondSuccess_1.default)(res, 'Create new application successfully', application, 201);
    }
    catch (error) {
        next(error);
    }
};
ApplicationController.getApplicationsbyEmployer = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const applications = await applicationServices_1.default.handleGetApplicationsbyEmployer(userId, req.query);
        return (0, respondSuccess_1.default)(res, 'get applications by employer successfully', applications);
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
        return (0, respondSuccess_1.default)(res, 'get application by employer successfully', application);
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
        return (0, respondSuccess_1.default)(res, 'update application by employer successfully', application);
    }
    catch (error) {
        next(error);
    }
};
ApplicationController.getApplicationsByAdmin = async (req, res, next) => {
    try {
        const applications = await applicationServices_1.default.handleGetApplicationsByAdmin(req.query);
        return (0, respondSuccess_1.default)(res, 'get applications by admin successfully', applications);
    }
    catch (error) {
        next(error);
    }
};
exports.default = ApplicationController;
//# sourceMappingURL=applicationController.js.map