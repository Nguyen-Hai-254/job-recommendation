"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const httpException_1 = require("../exceptions/httpException");
const authServices_1 = __importDefault(require("../services/authServices"));
class AuthController {
}
_a = AuthController;
AuthController.register = async (req, res, next) => {
    try {
        const { email, password, confirmPassword, role } = req.body;
        if (!email || !password || !confirmPassword || !role)
            throw new httpException_1.HttpException(400, 'Invalid email, password, confirm password or role');
        const data = await authServices_1.default.handleRegister(email, password, confirmPassword, role);
        return res.status(201).json({ message: 'Register account successfully', data: data });
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
        res.cookie("jwt", data.access_token, { httpOnly: true });
        return res.status(200).json({ message: 'login successfully', data: data });
    }
    catch (error) {
        next(error);
    }
};
AuthController.logOut = async (req, res, next) => {
    try {
        res.setHeader('jwt', ['Authorization=; Max-age=0']);
        res.clearCookie("jwt");
        const data = req.user;
        if (req.user)
            req.user = null;
        return res.status(200).json({ message: 'Logged out!', data: data });
    }
    catch (error) {
        next(error);
    }
};
AuthController.resetPassword = async (req, res, next) => {
    try {
        const { email } = req.user;
        const { password, newPassword, confirmNewPassword } = req.body;
        if (!email || !password || !newPassword || !confirmNewPassword) {
            throw new httpException_1.HttpException(400, 'Invalid input');
        }
        const userData = await authServices_1.default.handleResetPassword(email, password, newPassword, confirmNewPassword);
        return res.status(200).json({ message: 'Reset password successfully', data: userData });
    }
    catch (error) {
        next(error);
    }
};
exports.default = AuthController;
//# sourceMappingURL=authController.js.map