"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const followServices_1 = __importDefault(require("../services/followServices"));
class FollowController {
}
_a = FollowController;
FollowController.followCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.employerId) {
            return res.status(500).json({
                message: 'Thiếu id của công ty',
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const data = yield followServices_1.default.handleFollowCompany(req.user, req.body.employerId);
        return res.status(data.status).json({
            status: data.status,
            message: data.message,
            data: data.data ? data.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
FollowController.saveEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.employeeId || !req.body.isOnlineProfile) {
            return res.status(500).json({
                message: 'Thiếu thông tin người xin việc',
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const data = yield followServices_1.default.handleSaveEmployee(req.user, req.body.employeeId, req.body.isOnlineProfile);
        return res.status(data.status).json({
            status: data.status,
            message: data.message,
            data: data.data ? data.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
FollowController.getFollowByEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield followServices_1.default.handleGetFollowByEmployee(req.user);
        return res.status(data.status).json({
            status: data.status,
            message: data.message,
            data: data.data ? data.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
FollowController.getSaveEmployeeByEmployer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield followServices_1.default.handleGetSaveEmployeeByEmployer(req.user);
        return res.status(data.status).json({
            status: data.status,
            message: data.message,
            data: data.data ? data.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
FollowController.followJobPosting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.jobPosting) {
            return res.status(500).json({
                message: 'Thiếu id của đăng tuyển',
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const data = yield followServices_1.default.handleFollowJobPosting(req.user, req.body.jobPosting);
        return res.status(data.status).json({
            status: data.status,
            message: data.message,
            data: data.data ? data.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
FollowController.getFollowJobPosting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield followServices_1.default.handleGetFollowJobPosting(req.user);
        return res.status(data.status).json({
            status: data.status,
            message: data.message,
            data: data.data ? data.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
exports.default = FollowController;
//# sourceMappingURL=followController.js.map