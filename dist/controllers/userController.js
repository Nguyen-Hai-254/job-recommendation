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
const userServices_1 = __importDefault(require("../services/userServices"));
class UserController {
}
_a = UserController;
UserController.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.email || !req.body.password || !req.body.confirmPassword) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const { email, password, confirmPassword, role } = req.body;
        const data = yield userServices_1.default.handleRegister(email, password, confirmPassword, role);
        return res.status(data.status).json({
            status: data.status,
            message: data.message,
        });
    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
UserController.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const userData = yield userServices_1.default.handleLogin(req.body.email, req.body.password);
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
});
UserController.logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
UserController.getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUser = yield userServices_1.default.handleGetProfile(req.user);
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
});
UserController.editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const editUser = yield userServices_1.default.handleEditProfile(req.user, req.body);
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
});
UserController.getInformationCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getCompany = yield userServices_1.default.handleGetInformationCompany(req.user);
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
});
UserController.editInformationCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const editCompany = yield userServices_1.default.handleEditInformationCompany(req.user, req.body);
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
});
UserController.uploadAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.avatar) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const avatar = yield userServices_1.default.handleUploadAvatar(req.user, req.body.avatar);
        return res.status(avatar.status).json(avatar);
    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
UserController.uploadLogo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.logo) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const logo = yield userServices_1.default.handleUploadLogo(req.user, req.body.logo);
        return res.status(logo.status).json(logo);
    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
UserController.uploadBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.banner) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const banner = yield userServices_1.default.handleUploadBanner(req.user, req.body.banner);
        return res.status(banner.status).json(banner);
    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
UserController.getInformationCompanyByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.query.employerId) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const company = yield userServices_1.default.handleGetInformationCompanyByUser(req.query.employerId);
        return res.status(company.status).json(company);
    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
UserController.getAllCompanyByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.query.num || !req.query.page) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const companyList = yield userServices_1.default.handleGetAllCompanyByUser(req.query.num, req.query.page);
        return res.status(companyList.status).json(companyList);
    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
UserController.deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userServices_1.default.handleDeleteUser(req);
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
});
UserController.getOnlineProfileByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.query.userId) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const user = yield userServices_1.default.handleGetOnlineProfileByUser(req.query.userId);
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
});
UserController.getAttachedDocumentByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.query.userId) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const user = yield userServices_1.default.handleGetAttachedDocumentByUser(req.query.userId);
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
});
exports.default = UserController;
//# sourceMappingURL=userController.js.map