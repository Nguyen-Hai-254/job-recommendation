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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const connectDB_1 = require("../config/connectDB");
const AttachedDocument_1 = require("../entity/AttachedDocument");
const Employee_1 = require("../entity/Employee");
const Employer_1 = require("../entity/Employer");
const Notification_1 = require("../entity/Notification");
const OnlineProfile_1 = require("../entity/OnlineProfile");
const Users_1 = require("../entity/Users");
const enum_1 = require("../utils/enum");
const JWTAction_1 = require("../utils/JWTAction");
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const userRepository = connectDB_1.myDataSource.getRepository(Users_1.User);
const employerRepository = connectDB_1.myDataSource.getRepository(Employer_1.Employer);
const employeeRepository = connectDB_1.myDataSource.getRepository(Employee_1.Employee);
const notificationRepository = connectDB_1.myDataSource.getRepository(Notification_1.Notification);
const online_profileRepository = connectDB_1.myDataSource.getRepository(OnlineProfile_1.OnlineProfile);
const attached_documentRepository = connectDB_1.myDataSource.getRepository(AttachedDocument_1.AttachedDocument);
class UserServices {
}
_a = UserServices;
UserServices.handleRegister = (email, password, confirmPassword, role) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const checkEmail = yield userRepository.findOne({
        where: { email: email },
        relations: ['employer']
    });
    if (checkEmail) {
        if ((_b = checkEmail.employer) === null || _b === void 0 ? void 0 : _b.userId) {
            return ({
                message: 'This email is registered as an employer',
                status: 409,
                data: null
            });
        }
        return ({
            message: 'Email already exists!',
            status: 409,
            data: null
        });
    }
    if (password != confirmPassword) {
        return ({
            message: 'Password does not match confirm password',
            status: 400,
            data: null
        });
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashPassWord = yield bcrypt_1.default.hash(password, salt);
    const createUser = yield userRepository.create({
        email: email,
        password: hashPassWord,
        role: role
    });
    const userData = yield userRepository.save(createUser);
    if (role === 'employer' || role === 'EMPLOYER' || role === 'Employer') {
        const createEmployer = yield employerRepository.create({
            userId: userData.userId
        });
        yield employerRepository.save(createEmployer);
    }
    else if (role === 'admin') {
    }
    else {
        const createEmployee = yield employeeRepository.create({
            userId: userData.userId
        });
        yield employeeRepository.save(createEmployee);
    }
    return ({
        message: 'Create user successful!',
        status: 200,
    });
});
UserServices.handleLogin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield userRepository
        .createQueryBuilder('user')
        .select("user")
        .addSelect("user.password")
        .where('user.email = :email', { email })
        .getOne();
    if (!findUser) {
        return ({
            message: `Your's email is't exist`,
            status: 404,
            data: null
        });
    }
    const checkUserPassword = yield bcrypt_1.default.compare(password, findUser.password);
    if (!checkUserPassword) {
        return ({
            message: 'Wrong password!',
            status: 401,
            data: null
        });
    }
    let payload = {
        userId: findUser.userId,
        email: findUser.email,
        role: findUser.role,
        expireIn: process.env.JWT_EXPIRE_IN
    };
    let token = (0, JWTAction_1.createToken)(payload);
    return ({
        message: 'Login successful!',
        status: 200,
        data: {
            access_token: token,
            userData: {
                userId: findUser.userId,
                email: findUser.email,
                role: findUser.role
            }
        }
    });
});
UserServices.handleGetProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const getUserProfile = yield userRepository.findOne({
        where: { userId: user.userId },
        relations: ['employee']
    });
    if (!getUserProfile) {
        return ({
            message: `This account isn't registered`,
            status: 404,
            data: null
        });
    }
    return ({
        message: 'OK!',
        status: 200,
        data: {
            userId: getUserProfile.userId,
            email: getUserProfile.email,
            name: getUserProfile.name,
            role: getUserProfile.role,
            dob: (0, moment_1.default)(getUserProfile.dob).format("DD-MM-YYYY"),
            address: getUserProfile.address,
            phone: getUserProfile.phone,
            sex: getUserProfile.sex,
            avatar: getUserProfile.avatar,
            isMarried: ((_c = getUserProfile.employee) === null || _c === void 0 ? void 0 : _c.isMarried) ? getUserProfile.employee.isMarried : null
        }
    });
});
UserServices.handleEditProfile = (user, body) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    let findUser = yield userRepository.findOne({
        where: { userId: user.userId },
        relations: ['employee']
    });
    if (!findUser) {
        return ({
            message: `This account isn't registered`,
            status: 404,
            data: null
        });
    }
    findUser.name = body.name ? body.name : null;
    findUser.dob = new Date((0, moment_1.default)(body.dob, "DD-MM-YYYY").format("MM-DD-YYYY"));
    findUser.address = body.address ? body.address : null;
    findUser.phone = body.phone ? body.phone : null;
    if (body.sex == 1) {
        findUser.sex = enum_1.sex.Male;
    }
    else if (body.sex == 2) {
        findUser.sex = enum_1.sex.Female;
    }
    else {
        findUser.sex = enum_1.sex.Other;
    }
    if (findUser.employee) {
        findUser.employee.isMarried = body.isMarried === '1' ? true : false;
        yield employeeRepository.save(findUser.employee);
    }
    yield userRepository.save(findUser);
    const createNotification = notificationRepository.create({
        content: 'Bạn đã cập nhật thông tin cá nhân',
        user: findUser
    });
    yield notificationRepository.save(createNotification);
    return ({
        message: 'Update your profile successful!',
        status: 200,
        data: {
            userId: findUser.userId,
            email: findUser.email,
            name: findUser.name,
            dob: (0, moment_1.default)(findUser.dob).format("DD-MM-YYYY"),
            address: findUser.address,
            phone: findUser.phone,
            sex: findUser.sex,
            isMarried: ((_d = findUser.employee) === null || _d === void 0 ? void 0 : _d.isMarried) ? findUser.employee.isMarried : null
        }
    });
});
UserServices.handleGetInformationCompany = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const getEmployer = yield userRepository.findOne({
        where: { userId: user.userId },
        relations: ['employer']
    });
    if (!getEmployer) {
        return ({
            message: `This account isn't registered`,
            status: 404,
            data: null
        });
    }
    if (getEmployer.role !== enum_1.userRole.Employer) {
        return ({
            message: `You are not a employer`,
            status: 403,
            data: null
        });
    }
    return ({
        message: `OK!`,
        status: 200,
        data: {
            userId: getEmployer.userId,
            email: getEmployer.email,
            name: getEmployer.name,
            role: getEmployer.role,
            taxCode: getEmployer.employer.taxCode,
            companyName: getEmployer.employer.companyName,
            companyLocation: getEmployer.employer.companyLocation,
            careerField: getEmployer.employer.careerField,
            logo: getEmployer.employer.logo,
            banner: getEmployer.employer.banner,
            description: getEmployer.employer.description
        }
    });
});
UserServices.handleEditInformationCompany = (user, body) => __awaiter(void 0, void 0, void 0, function* () {
    let findEmployer = yield userRepository.findOne({
        where: { userId: user.userId },
        relations: ['employer']
    });
    if (!findEmployer) {
        return ({
            message: `This account isn't registered`,
            status: 404,
            data: null
        });
    }
    findEmployer.employer.taxCode = body.taxCode;
    findEmployer.employer.companyName = body.companyName;
    findEmployer.employer.companyLocation = body.companyLocation;
    findEmployer.employer.careerField = body.careerField;
    findEmployer.employer.description = body.description;
    yield employerRepository.save(findEmployer.employer);
    const createNotification = notificationRepository.create({
        content: 'Bạn đã cập nhật thông tin công ty của bạn',
        user: findEmployer
    });
    yield notificationRepository.save(createNotification);
    return ({
        message: `Edit your company successful!`,
        status: 200,
        data: {
            userId: findEmployer.userId,
            email: findEmployer.email,
            name: findEmployer.name,
            role: findEmployer.role,
            taxCode: findEmployer.employer.taxCode,
            companyName: findEmployer.employer.companyName,
            companyLocation: findEmployer.employer.companyLocation,
            careerField: findEmployer.employer.careerField,
            description: findEmployer.employer.description
        }
    });
});
UserServices.handleUploadAvatar = (user, avatar) => __awaiter(void 0, void 0, void 0, function* () {
    let findUser = yield userRepository.findOne({
        where: { userId: user.userId }
    });
    if (!findUser) {
        return ({
            message: `This account isn't registered`,
            status: 404,
            data: null
        });
    }
    findUser.avatar = avatar;
    yield userRepository.save(findUser);
    const notification = notificationRepository.create({
        content: 'Bạn đã cập nhật ảnh đại diện',
        user: findUser
    });
    yield notificationRepository.save(notification);
    return ({
        message: `Cập nhật ảnh đại diện thành công`,
        status: 200,
        data: {
            userId: findUser.userId,
            email: findUser.email,
            avatar: findUser.avatar,
            role: findUser.role
        }
    });
});
UserServices.handleUploadLogo = (user, logo) => __awaiter(void 0, void 0, void 0, function* () {
    let findEmployer = yield employerRepository.findOne({
        where: { userId: user.userId }
    });
    if (!findEmployer) {
        return ({
            message: `This account isn't registered`,
            status: 404,
            data: null
        });
    }
    findEmployer.logo = logo;
    yield employerRepository.save(findEmployer);
    const notification = notificationRepository.create({
        content: 'Bạn đã cập nhật logo của công ty',
        user: findEmployer
    });
    yield notificationRepository.save(notification);
    return ({
        message: `Cập nhật logo công ty thành công`,
        status: 200,
        data: {
            userId: findEmployer.userId,
            companyName: findEmployer.companyName,
            avatar: findEmployer.logo
        }
    });
});
UserServices.handleUploadBanner = (user, banner) => __awaiter(void 0, void 0, void 0, function* () {
    let findEmployer = yield employerRepository.findOne({
        where: { userId: user.userId }
    });
    if (!findEmployer) {
        return ({
            message: `This account isn't registered`,
            status: 404,
            data: null
        });
    }
    findEmployer.banner = banner;
    yield employerRepository.save(findEmployer);
    const notification = notificationRepository.create({
        content: 'Bạn đã cập nhật banner của công ty',
        user: findEmployer
    });
    yield notificationRepository.save(notification);
    return ({
        message: `Cập nhật banner công ty thành công`,
        status: 200,
        data: {
            userId: findEmployer.userId,
            companyName: findEmployer.companyName,
            banner: findEmployer.banner
        }
    });
});
UserServices.handleGetInformationCompanyByUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const getEmployer = yield userRepository.findOne({
        where: {
            userId: id,
            employer: {
                jobPostings: {
                    status: enum_1.approvalStatus.approved
                }
            }
        },
        relations: ['employer.jobPostings']
    });
    if (!getEmployer) {
        return ({
            message: `Công ty không tồn tại`,
            status: 404,
            data: null
        });
    }
    return ({
        message: `OK!`,
        status: 200,
        data: {
            userId: getEmployer.userId,
            email: getEmployer.email,
            name: getEmployer.name,
            role: getEmployer.role,
            taxCode: getEmployer.employer.taxCode,
            companyName: getEmployer.employer.companyName,
            companyLocation: getEmployer.employer.companyLocation,
            careerField: getEmployer.employer.careerField,
            logo: getEmployer.employer.logo,
            banner: getEmployer.employer.banner,
            description: getEmployer.employer.description,
            list_job_postings: (_e = getEmployer.employer) === null || _e === void 0 ? void 0 : _e.jobPostings
        }
    });
});
UserServices.handleGetAllCompanyByUser = (num, page) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (parseInt(page) - 1) * parseInt(num);
    const take = parseInt(num);
    const getEmployer = yield employerRepository.find({ skip: skip, take: take });
    const totalCompany = yield employerRepository.count({});
    return ({
        message: `OK!`,
        status: 200,
        data: {
            companyList: getEmployer,
            totalCompany
        }
    });
});
UserServices.handleDeleteUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of user is required',
            status: 400,
            data: null
        });
    }
    const user = yield userRepository.findOne({
        where: { userId: req.params.id },
    });
    if (!user) {
        return ({
            message: `user has id: ${req.params.id} not found`,
            status: 400,
            data: null
        });
    }
    yield userRepository.delete(user.userId);
    return ({
        message: `Delete user has id: ${user.userId}  successfully`,
        status: 200,
        data: user
    });
});
UserServices.handleGetOnlineProfileByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const online_profile = yield online_profileRepository.findOne({
        where: { employee: { userId: userId }, isHidden: false },
        relations: ['employee.user', 'another_degrees', 'education_informations', 'work_experiences']
    });
    if (!online_profile) {
        return ({
            message: 'No online profile found',
            status: 400,
            data: null
        });
    }
    yield online_profileRepository.createQueryBuilder('onl')
        .update()
        .set({
        view: () => "view + 1"
    })
        .execute();
    let data = Object.assign({ email: online_profile.employee.user.email, name: online_profile.employee.user.name, dob: online_profile.employee.user.dob, address: online_profile.employee.user.address, phone: online_profile.employee.user.phone, sex: online_profile.employee.user.sex, avatar: online_profile.employee.user.avatar, isMarried: online_profile.employee.isMarried }, online_profile);
    let { employee } = data, newData = __rest(data, ["employee"]);
    return ({
        message: 'Find online profile success',
        status: 200,
        data: newData
    });
});
UserServices.handleGetAttachedDocumentByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const attached_document = yield attached_documentRepository.findOne({
        where: { employee: { userId: userId }, isHidden: false },
        relations: ['employee.user']
    });
    if (!attached_document) {
        return ({
            message: 'No attached document found',
            status: 400,
            data: null
        });
    }
    yield attached_documentRepository.createQueryBuilder('att')
        .update()
        .set({
        view: () => "view + 1"
    })
        .execute();
    let data = Object.assign({ email: attached_document.employee.user.email, name: attached_document.employee.user.name, dob: attached_document.employee.user.dob, address: attached_document.employee.user.address, phone: attached_document.employee.user.phone, sex: attached_document.employee.user.sex, avatar: attached_document.employee.user.avatar, isMarried: attached_document.employee.isMarried }, attached_document);
    let { employee } = data, newData = __rest(data, ["employee"]);
    return ({
        message: 'Find attached document success',
        status: 200,
        data: newData
    });
});
exports.default = UserServices;
//# sourceMappingURL=userServices.js.map