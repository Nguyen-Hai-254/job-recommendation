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
        userData: payload
    };
};
AuthServices.handleResetPassword = async (email, password, newPassword, confirmNewPassword) => {
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
exports.default = AuthServices;
//# sourceMappingURL=authServices.js.map