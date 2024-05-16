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
UserController.register = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password || !req.body.confirmPassword) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const { email, password, confirmPassword, role } = req.body;
        const data = await userServices_1.default.handleRegister(email, password, confirmPassword, role);
        return res.status(data.status).json({
            status: data.status,
            message: data.message,
            // userData: data.data ? data.data : []
        });
    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
UserController.login = async (req, res) => {
    var _b;
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const userData = await userServices_1.default.handleLogin(req.body.email, req.body.password);
        res.cookie("jwt", (_b = userData.data) === null || _b === void 0 ? void 0 : _b.access_token, { httpOnly: true });
        return res.status(userData.status).json({
            status: userData.status,
            message: userData.message,
            data: userData.data ? userData.data : []
        });
    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
UserController.logOut = async (req, res) => {
    try {
        res.clearCookie("jwt");
        if (req.user)
            req.user = null;
        return res.status(200).json({
            message: 'Logged out!',
            status: 200
        });
    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
UserController.getProfile = async (req, res) => {
    try {
        const getUser = await userServices_1.default.handleGetProfile(req.user);
        return res.status(getUser.status).json({
            message: getUser.message,
            status: getUser.status,
            data: getUser.data ? getUser.data : []
        });
    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
UserController.editProfile = async (req, res) => {
    try {
        const editUser = await userServices_1.default.handleEditProfile(req.user, req.body);
        return res.status(editUser.status).json({
            message: editUser.message,
            status: editUser.status,
            data: editUser.data ? editUser.data : []
        });
    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
UserController.getInformationCompany = async (req, res) => {
    try {
        const getCompany = await userServices_1.default.handleGetInformationCompany(req.user);
        return res.status(getCompany.status).json({
            message: getCompany.message,
            status: getCompany.status,
            data: getCompany.data ? getCompany.data : []
        });
    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
UserController.editInformationCompany = async (req, res) => {
    try {
        const editCompany = await userServices_1.default.handleEditInformationCompany(req.user, req.body);
        return res.status(editCompany.status).json({
            message: editCompany.message,
            status: editCompany.status,
            data: editCompany.data ? editCompany.data : []
        });
    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
UserController.uploadAvatar = async (req, res) => {
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
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
UserController.uploadLogo = async (req, res) => {
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
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
UserController.uploadBanner = async (req, res) => {
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
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
UserController.getInformationCompanyByUser = async (req, res) => {
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
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
UserController.getAllCompanyByUser = async (req, res) => {
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
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
UserController.deleteUser = async (req, res) => {
    try {
        const user = await userServices_1.default.handleDeleteUser(req);
        return res.status(user.status).json({
            message: user.message,
            status: user.status,
            data: user.data
        });
    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
UserController.getOnlineProfileByUser = async (req, res) => {
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
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
UserController.getAttachedDocumentByUser = async (req, res) => {
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
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
exports.default = UserController;
//# sourceMappingURL=userController.js.map