"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const httpException_1 = require("../exceptions/httpException");
const connectDB_1 = require("../config/connectDB");
const Users_1 = require("../entity/Users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const enum_1 = require("../utils/enum");
const Employee_1 = require("../entity/Employee");
const Employer_1 = require("../entity/Employer");
const redisServices_1 = __importDefault(require("./redisServices"));
const mailServices_1 = __importDefault(require("../services/mailServices"));
const userServices_1 = __importDefault(require("../services/userServices"));
const createToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};
exports.createToken = createToken;
const userRepository = connectDB_1.myDataSource.getRepository(Users_1.User);
const employeeRepository = connectDB_1.myDataSource.getRepository(Employee_1.Employee);
const employerRepository = connectDB_1.myDataSource.getRepository(Employer_1.Employer);
class AuthServices {
}
_a = AuthServices;
AuthServices.handleRegister = async (email, password, confirmPassword, role) => {
    if (password != confirmPassword)
        throw new httpException_1.HttpException(400, 'Password does not match confirm password');
    if (role.toLowerCase() === 'admin')
        throw new httpException_1.HttpException(403, 'You do not have permission to register a admin account');
    try {
        const salt = await bcrypt_1.default.genSalt(10);
        const hashPassWord = await bcrypt_1.default.hash(password, salt);
        const createUser = userRepository.create({
            email: email,
            password: hashPassWord,
            role: role
        });
        const user = await userRepository.save(createUser);
        if (role.toLowerCase() === 'employer') {
            const createEmployer = employerRepository.create({ userId: user.userId });
            await employerRepository.save(createEmployer);
        }
        else if (role.toLowerCase() === 'employee') {
            const createEmployee = employeeRepository.create({ userId: user.userId });
            await employeeRepository.save(createEmployee);
        }
        return {
            userId: user.userId,
            email: user.email,
            role: user.role
        };
    }
    catch (err) {
        if (err.code === enum_1.MySQLErrorCode.DUPLICATE) {
            throw new httpException_1.HttpException(409, 'Email already exists!');
        }
        throw err;
    }
};
AuthServices.handleLogin = async (email, password) => {
    const findUser = await userRepository
        .createQueryBuilder('user')
        .select("user")
        .addSelect("user.password")
        .where('user.email = :email', { email })
        .getOne();
    if (!findUser)
        throw new httpException_1.HttpException(409, "Email not found");
    const checkUserPassword = await bcrypt_1.default.compare(password, findUser.password);
    if (!checkUserPassword)
        throw new httpException_1.HttpException(401, "Password incorrect");
    const payload = {
        userId: findUser.userId,
        email: findUser.email,
        role: findUser.role,
    };
    const token = (0, exports.createToken)(payload);
    return {
        access_token: token,
        expiresIn: process.env.JWT_EXPIRES_IN,
        userData: payload,
    };
};
AuthServices.handleLogout = async (jwt1, jwt2) => {
    if (jwt1)
        await redisServices_1.default.setBlockedToken(jwt1);
    if (jwt2)
        await redisServices_1.default.setBlockedToken(jwt1);
    if (jwt1 === null && jwt2 === null) {
        throw new httpException_1.HttpException(401, "You have already logged out before.");
    }
    return;
};
AuthServices.handleChangePassword = async (email, password, newPassword, confirmNewPassword) => {
    if (newPassword != confirmNewPassword) {
        throw new httpException_1.HttpException(400, 'new Password does not match new confirm password');
    }
    const findUser = await userRepository
        .createQueryBuilder('user')
        .select("user")
        .addSelect("user.password")
        .where('user.email = :email', { email })
        .getOne();
    if (!findUser)
        throw new httpException_1.HttpException(404, `Your's email is't exist`);
    const checkUserPassword = await bcrypt_1.default.compare(password, findUser.password);
    if (!checkUserPassword)
        throw new httpException_1.HttpException(401, 'Your password is incorrect');
    const salt = await bcrypt_1.default.genSalt(10);
    const hashPassWord = await bcrypt_1.default.hash(newPassword, salt);
    findUser.password = hashPassWord;
    await findUser.save();
    return {
        userId: findUser.userId,
        email: findUser.email,
        role: findUser.role
    };
};
AuthServices.hanldeRequestPasswordReset = async (email) => {
    const userId = await userServices_1.default.getUserIdByEmail(email);
    const token = _a.generatePasswordResetToken();
    const expiresAt = new Date().getTime() + 10 * 60 * 1000; // Mã xác thực có hiệu lực 10 phút
    await _a.storePasswordResetToken(userId, token, expiresAt);
    await mailServices_1.default.sendTokenForResetPassword(email, token);
};
AuthServices.handleResetPassword = async (email, token, newPassword) => {
    const findUser = await userRepository.findOneBy({ email: email });
    if (!findUser)
        throw new httpException_1.HttpException(404, `Your's email is't exist`);
    const isTokenValid = await _a.verifyPasswordResetToken(findUser.userId, token);
    if (!isTokenValid)
        throw new httpException_1.HttpException(401, 'Invalid token');
    const salt = await bcrypt_1.default.genSalt(10);
    const hashPassWord = await bcrypt_1.default.hash(newPassword, salt);
    findUser.password = hashPassWord;
    await findUser.save();
    return {
        userId: findUser.userId,
        email: findUser.email,
        role: findUser.role
    };
};
AuthServices.generatePasswordResetToken = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã xác thực 6 số ngẫu nhiên
};
AuthServices.storePasswordResetToken = async (userId, token, expiresAt) => {
    await redisServices_1.default.setPasswordResetToken(userId, token, expiresAt);
};
AuthServices.verifyPasswordResetToken = async (userId, token) => {
    const storedToken = await redisServices_1.default.getPasswordResetToken(userId);
    return storedToken === token;
};
exports.default = AuthServices;
//# sourceMappingURL=authServices.js.map