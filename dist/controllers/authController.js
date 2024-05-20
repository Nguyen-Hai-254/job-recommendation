"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middleware/auth");
const httpException_1 = require("../exceptions/httpException");
const authServices_1 = __importDefault(require("../services/authServices"));
const respondSuccess_1 = __importDefault(require("../utils/respondSuccess"));
class AuthController {
}
_a = AuthController;
AuthController.register = async (req, res, next) => {
    try {
        const { email, password, confirmPassword, role } = req.body;
        if (!email || !password || !confirmPassword || !role)
            throw new httpException_1.HttpException(400, 'Invalid email, password, confirm password or role');
        const data = await authServices_1.default.handleRegister(email, password, confirmPassword, role);
        return (0, respondSuccess_1.default)(res, 'Register account successfully', data, 201);
    }
    catch (error) {
        next(error);
    }
};
AuthController.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            throw new httpException_1.HttpException(400, 'Invalid email or password');
        const data = await authServices_1.default.handleLogin(email, password);
        res.cookie('jwt', data.access_token, { httpOnly: true, expiresIn: data.expiresIn });
        return (0, respondSuccess_1.default)(res, 'login successfully', data);
    }
    catch (error) {
        next(error);
    }
};
AuthController.logOut = async (req, res, next) => {
    try {
        const jwt1 = await (0, auth_1.tokenFromHeader)(req);
        const jwt2 = await (0, auth_1.tokenFromCookie)(req);
        res.clearCookie('jwt');
        const data = req.user;
        if (req.user)
            req.user = null;
        await authServices_1.default.handleLogout(jwt1, jwt2);
        return (0, respondSuccess_1.default)(res, "You've been logged out!", data.email);
    }
    catch (error) {
        next(error);
    }
};
AuthController.changePassword = async (req, res, next) => {
    try {
        const { email } = req.user;
        const { password, newPassword, confirmNewPassword } = req.body;
        if (!email || !password || !newPassword || !confirmNewPassword) {
            throw new httpException_1.HttpException(400, 'Invalid input');
        }
        const userData = await authServices_1.default.handleChangePassword(email, password, newPassword, confirmNewPassword);
        return (0, respondSuccess_1.default)(res, 'Change password successfully', userData);
    }
    catch (error) {
        next(error);
    }
};
AuthController.requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email)
            throw new httpException_1.HttpException(400, 'Email is required');
        await authServices_1.default.hanldeRequestPasswordReset(email);
        return (0, respondSuccess_1.default)(res, 'Password reset instructions have been sent to your email');
    }
    catch (error) {
        next(error);
    }
};
AuthController.resetPassword = async (req, res, next) => {
    try {
        const { email, token, newPassword } = req.body;
        if (!email || !token || !newPassword) {
            throw new httpException_1.HttpException(400, 'email, token and new password are required');
        }
        const userData = await authServices_1.default.handleResetPassword(email, token, newPassword);
        return (0, respondSuccess_1.default)(res, 'Password reset successfully.', userData);
    }
    catch (error) {
        next(error);
    }
};
exports.default = AuthController;
//# sourceMappingURL=authController.js.map