"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const userServices_1 = __importDefault(require("../services/userServices"));
class UserController {
}
_a = UserController;
UserController.getProfile = async (req, res, next) => {
    try {
        const getUser = await userServices_1.default.handleGetProfile(req.user);
        return res.status(getUser.status).json({
            message: getUser.message,
            status: getUser.status,
            data: getUser.data ? getUser.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
UserController.editProfile = async (req, res, next) => {
    try {
        const editUser = await userServices_1.default.handleEditProfile(req.user, req.body);
        return res.status(editUser.status).json({
            message: editUser.message,
            status: editUser.status,
            data: editUser.data ? editUser.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
UserController.getInformationCompany = async (req, res, next) => {
    try {
        const getCompany = await userServices_1.default.handleGetInformationCompany(req.user);
        return res.status(getCompany.status).json({
            message: getCompany.message,
            status: getCompany.status,
            data: getCompany.data ? getCompany.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
UserController.editInformationCompany = async (req, res, next) => {
    try {
        const editCompany = await userServices_1.default.handleEditInformationCompany(req.user, req.body);
        return res.status(editCompany.status).json({
            message: editCompany.message,
            status: editCompany.status,
            data: editCompany.data ? editCompany.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
UserController.uploadAvatar = async (req, res, next) => {
    try {
        if (!req.body.avatar) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const avatar = await userServices_1.default.handleUploadAvatar(req.user, req.body.avatar);
        return res.status(avatar.status).json(avatar);
    }
    catch (error) {
        next(error);
    }
};
UserController.uploadLogo = async (req, res, next) => {
    try {
        if (!req.body.logo) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const logo = await userServices_1.default.handleUploadLogo(req.user, req.body.logo);
        return res.status(logo.status).json(logo);
    }
    catch (error) {
        next(error);
    }
};
UserController.uploadBanner = async (req, res, next) => {
    try {
        if (!req.body.banner) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const banner = await userServices_1.default.handleUploadBanner(req.user, req.body.banner);
        return res.status(banner.status).json(banner);
    }
    catch (error) {
        next(error);
    }
};
UserController.getInformationCompanyByUser = async (req, res, next) => {
    try {
        if (!req.query.employerId) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const company = await userServices_1.default.handleGetInformationCompanyByUser(req.query.employerId);
        return res.status(company.status).json(company);
    }
    catch (error) {
        next(error);
    }
};
UserController.getAllCompanyByUser = async (req, res, next) => {
    try {
        if (!req.query.num || !req.query.page) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const companyList = await userServices_1.default.handleGetAllCompanyByUser(req.query.num, req.query.page);
        return res.status(companyList.status).json(companyList);
    }
    catch (error) {
        next(error);
    }
};
UserController.deleteUser = async (req, res, next) => {
    try {
        const user = await userServices_1.default.handleDeleteUser(req);
        return res.status(user.status).json({
            message: user.message,
            status: user.status,
            data: user.data
        });
    }
    catch (error) {
        next(error);
    }
};
UserController.getOnlineProfileByUser = async (req, res, next) => {
    try {
        if (!req.query.userId) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const user = await userServices_1.default.handleGetOnlineProfileByUser(req.query.userId);
        return res.status(user.status).json({
            message: user.message,
            status: user.status,
            data: user.data
        });
    }
    catch (error) {
        next(error);
    }
};
UserController.getAttachedDocumentByUser = async (req, res, next) => {
    try {
        if (!req.query.userId) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const user = await userServices_1.default.handleGetAttachedDocumentByUser(req.query.userId);
        return res.status(user.status).json({
            message: user.message,
            status: user.status,
            data: user.data
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = UserController;
//# sourceMappingURL=userController.js.map