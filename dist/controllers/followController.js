"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const httpException_1 = require("../exceptions/httpException");
const followServices_1 = __importDefault(require("../services/followServices"));
class FollowController {
}
_a = FollowController;
FollowController.followCompany = async (req, res, next) => {
    try {
        const { employerId } = req.body;
        if (!employerId)
            throw new httpException_1.HttpException(400, 'EmployerId required');
        const message = await followServices_1.default.handleFollowCompany(req.user, employerId);
        return res.status(200).json({ message: message, data: [] });
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
        return res.status(200).json({ message: message, data: [] });
    }
    catch (error) {
        next(error);
    }
};
FollowController.getFollowByEmployee = async (req, res, next) => {
    try {
        const data = await followServices_1.default.handleGetFollowByEmployee(req.user);
        return res.status(200).json({ message: "OK", data: data });
    }
    catch (error) {
        next(error);
    }
};
FollowController.getSaveEmployeeByEmployer = async (req, res, next) => {
    try {
        const data = await followServices_1.default.handleGetSaveEmployeeByEmployer(req.user);
        return res.status(200).json({ message: "OK", data: data });
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
        return res.status(200).json({
            message: message,
            data: []
        });
    }
    catch (error) {
        next(error);
    }
};
FollowController.getFollowJobPosting = async (req, res, next) => {
    try {
        const data = await followServices_1.default.handleGetFollowJobPosting(req.user);
        return res.status(200).json({ message: "OK", data: data });
    }
    catch (error) {
        next(error);
    }
};
exports.default = FollowController;
//# sourceMappingURL=followController.js.map