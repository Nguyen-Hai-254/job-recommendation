"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const httpException_1 = require("../exceptions/httpException");
const followServices_1 = __importDefault(require("../services/followServices"));
const respondSuccess_1 = __importDefault(require("../utils/respondSuccess"));
class FollowController {
}
_a = FollowController;
FollowController.followCompany = async (req, res, next) => {
    try {
        const { employerId } = req.body;
        if (!employerId)
            throw new httpException_1.HttpException(400, 'EmployerId required');
        const message = await followServices_1.default.handleFollowCompany(req.user, employerId);
        return (0, respondSuccess_1.default)(res, message);
    }
    catch (error) {
        next(error);
    }
};
FollowController.saveEmployee = async (req, res, next) => {
    try {
        const { employeeId, isOnlineProfile } = req.body;
        if (!employeeId || !isOnlineProfile)
            throw new httpException_1.HttpException(400, 'EmployeeId, isOnlineProfile required');
        const message = await followServices_1.default.handleSaveEmployee(req.user, employeeId, isOnlineProfile);
        return (0, respondSuccess_1.default)(res, message);
    }
    catch (error) {
        next(error);
    }
};
FollowController.getFollowByEmployee = async (req, res, next) => {
    try {
        const data = await followServices_1.default.handleGetFollowByEmployee(req.user, req.query);
        return (0, respondSuccess_1.default)(res, "OK", data);
    }
    catch (error) {
        next(error);
    }
};
FollowController.getSaveEmployeeByEmployer = async (req, res, next) => {
    try {
        const data = await followServices_1.default.handleGetSaveEmployeeByEmployer(req.user, req.query);
        return (0, respondSuccess_1.default)(res, "OK", data);
    }
    catch (error) {
        next(error);
    }
};
FollowController.followJobPosting = async (req, res, next) => {
    try {
        const { jobPosting } = req.body;
        if (!jobPosting)
            throw new httpException_1.HttpException(400, 'Job posting required');
        const message = await followServices_1.default.handleFollowJobPosting(req.user, jobPosting);
        return (0, respondSuccess_1.default)(res, message);
    }
    catch (error) {
        next(error);
    }
};
FollowController.getFollowJobPosting = async (req, res, next) => {
    try {
        const data = await followServices_1.default.handleGetFollowJobPosting(req.user, req.query);
        return (0, respondSuccess_1.default)(res, "OK", data);
    }
    catch (error) {
        next(error);
    }
};
exports.default = FollowController;
//# sourceMappingURL=followController.js.map