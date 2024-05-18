"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const followServices_1 = __importDefault(require("../services/followServices"));
class FollowController {
}
_a = FollowController;
FollowController.followCompany = async (req, res, next) => {
    try {
        if (!req.body.employerId) {
            return res.status(500).json({
                message: 'Thiếu id của công ty',
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const data = await followServices_1.default.handleFollowCompany(req.user, req.body.employerId);
        return res.status(data.status).json({
            status: data.status,
            message: data.message,
            data: data.data ? data.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
FollowController.saveEmployee = async (req, res, next) => {
    try {
        if (!req.body.employeeId || !req.body.isOnlineProfile) {
            return res.status(500).json({
                message: 'Thiếu thông tin người xin việc',
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const data = await followServices_1.default.handleSaveEmployee(req.user, req.body.employeeId, req.body.isOnlineProfile);
        return res.status(data.status).json({
            status: data.status,
            message: data.message,
            data: data.data ? data.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
FollowController.getFollowByEmployee = async (req, res, next) => {
    try {
        const data = await followServices_1.default.handleGetFollowByEmployee(req.user);
        return res.status(data.status).json({
            status: data.status,
            message: data.message,
            data: data.data ? data.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
FollowController.getSaveEmployeeByEmployer = async (req, res, next) => {
    try {
        const data = await followServices_1.default.handleGetSaveEmployeeByEmployer(req.user);
        return res.status(data.status).json({
            status: data.status,
            message: data.message,
            data: data.data ? data.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
FollowController.followJobPosting = async (req, res, next) => {
    try {
        if (!req.body.jobPosting) {
            return res.status(500).json({
                message: 'Thiếu id của đăng tuyển',
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const data = await followServices_1.default.handleFollowJobPosting(req.user, req.body.jobPosting);
        return res.status(data.status).json({
            status: data.status,
            message: data.message,
            data: data.data ? data.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
FollowController.getFollowJobPosting = async (req, res, next) => {
    try {
        const data = await followServices_1.default.handleGetFollowJobPosting(req.user);
        return res.status(data.status).json({
            status: data.status,
            message: data.message,
            data: data.data ? data.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = FollowController;
//# sourceMappingURL=followController.js.map