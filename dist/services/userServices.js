"use strict";
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
UserServices.handleRegister = async (email, password, confirmPassword, role) => {
    var _b;
    const checkEmail = await userRepository.findOne({
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
    const salt = await bcrypt_1.default.genSalt(10);
    const hashPassWord = await bcrypt_1.default.hash(password, salt);
    const createUser = await userRepository.create({
        email: email,
        password: hashPassWord,
        role: role
    });
    const userData = await userRepository.save(createUser);
    if (role === 'employer' || role === 'EMPLOYER' || role === 'Employer') {
        const createEmployer = await employerRepository.create({
            userId: userData.userId
        });
        await employerRepository.save(createEmployer);
    }
    else if (role === 'admin') {
    }
    else {
        const createEmployee = await employeeRepository.create({
            userId: userData.userId
        });
        await employeeRepository.save(createEmployee);
    }
    return ({
        message: 'Create user successful!',
        status: 200,
    });
};
UserServices.handleLogin = async (email, password) => {
    const findUser = await userRepository
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
    const checkUserPassword = await bcrypt_1.default.compare(password, findUser.password);
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
};
UserServices.handleResetPassword = async (email, password, newPassword) => {
    const findUser = await userRepository
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
    const checkUserPassword = await bcrypt_1.default.compare(password, findUser.password);
    if (!checkUserPassword) {
        return ({
            message: 'Wrong password!',
            status: 401,
            data: null
        });
    }
    const salt = await bcrypt_1.default.genSalt(10);
    const hashPassWord = await bcrypt_1.default.hash(newPassword, salt);
    findUser.password = hashPassWord;
    await findUser.save();
    return ({
        message: 'reset password success',
        status: 200,
    });
};
UserServices.handleGetProfile = async (user) => {
    var _b;
    const getUserProfile = await userRepository.findOne({
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
            isMarried: ((_b = getUserProfile.employee) === null || _b === void 0 ? void 0 : _b.isMarried) ? getUserProfile.employee.isMarried : null
        }
    });
};
UserServices.handleEditProfile = async (user, body) => {
    var _b;
    let findUser = await userRepository.findOne({
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
        await employeeRepository.save(findUser.employee);
    }
    await userRepository.save(findUser);
    const createNotification = notificationRepository.create({
        content: 'Bạn đã cập nhật thông tin cá nhân',
        user: findUser
    });
    await notificationRepository.save(createNotification);
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
            isMarried: ((_b = findUser.employee) === null || _b === void 0 ? void 0 : _b.isMarried) ? findUser.employee.isMarried : null
        }
    });
};
UserServices.handleGetInformationCompany = async (user) => {
    const getEmployer = await userRepository.findOne({
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
};
UserServices.handleEditInformationCompany = async (user, body) => {
    let findEmployer = await userRepository.findOne({
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
    await employerRepository.save(findEmployer.employer);
    const createNotification = notificationRepository.create({
        content: 'Bạn đã cập nhật thông tin công ty của bạn',
        user: findEmployer
    });
    await notificationRepository.save(createNotification);
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
};
UserServices.handleUploadAvatar = async (user, avatar) => {
    let findUser = await userRepository.findOne({
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
    await userRepository.save(findUser);
    const notification = notificationRepository.create({
        content: 'Bạn đã cập nhật ảnh đại diện',
        user: findUser
    });
    await notificationRepository.save(notification);
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
};
UserServices.handleUploadLogo = async (user, logo) => {
    let findEmployer = await employerRepository.findOne({
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
    await employerRepository.save(findEmployer);
    const notification = notificationRepository.create({
        content: 'Bạn đã cập nhật logo của công ty',
        user: findEmployer
    });
    await notificationRepository.save(notification);
    return ({
        message: `Cập nhật logo công ty thành công`,
        status: 200,
        data: {
            userId: findEmployer.userId,
            companyName: findEmployer.companyName,
            avatar: findEmployer.logo
        }
    });
};
UserServices.handleUploadBanner = async (user, banner) => {
    let findEmployer = await employerRepository.findOne({
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
    await employerRepository.save(findEmployer);
    const notification = notificationRepository.create({
        content: 'Bạn đã cập nhật banner của công ty',
        user: findEmployer
    });
    await notificationRepository.save(notification);
    return ({
        message: `Cập nhật banner công ty thành công`,
        status: 200,
        data: {
            userId: findEmployer.userId,
            companyName: findEmployer.companyName,
            banner: findEmployer.banner
        }
    });
};
UserServices.handleGetInformationCompanyByUser = async (id) => {
    var _b;
    // const getEmployer = await userRepository.findOne({
    //     where: {
    //         userId: id,
    //         employer: {
    //             jobPostings: {
    //                 status: approvalStatus.approved
    //             }
    //         }
    //     },
    //     relations: ['employer.jobPostings']
    // })
    const getEmployer = await userRepository
        .createQueryBuilder('user')
        .select(['user'])
        .leftJoinAndSelect('user.employer', 'employer')
        .leftJoinAndSelect('employer.jobPostings', 'jobPosting', 'jobPosting.status = :status', { status: enum_1.approvalStatus.approved })
        .where('user.userId = :id', { id })
        .getOne();
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
            list_job_postings: (_b = getEmployer.employer) === null || _b === void 0 ? void 0 : _b.jobPostings
        }
    });
};
UserServices.handleGetAllCompanyByUser = async (num, page) => {
    const skip = (parseInt(page) - 1) * parseInt(num);
    const take = parseInt(num);
    const getEmployer = await employerRepository.find({ skip: skip, take: take });
    const totalCompany = await employerRepository.count({});
    return ({
        message: `OK!`,
        status: 200,
        data: {
            companyList: getEmployer,
            totalCompany
        }
    });
};
UserServices.handleDeleteUser = async (req) => {
    // Check parameters
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of user is required',
            status: 400,
            data: null
        });
    }
    // Check education information exists?
    const user = await userRepository.findOne({
        where: { userId: req.params.id },
    });
    if (!user) {
        return ({
            message: `user has id: ${req.params.id} not found`,
            status: 400,
            data: null
        });
    }
    await userRepository.delete(user.userId);
    return ({
        message: `Delete user has id: ${user.userId}  successfully`,
        status: 200,
        data: user
    });
};
UserServices.handleGetOnlineProfileByUser = async (userId) => {
    const online_profile = await online_profileRepository.findOne({
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
    await online_profileRepository.createQueryBuilder('onl')
        .update()
        .set({
        view: () => "view + 1"
    })
        .execute();
    let data = {
        email: online_profile.employee.user.email,
        name: online_profile.employee.user.name,
        dob: online_profile.employee.user.dob,
        address: online_profile.employee.user.address,
        phone: online_profile.employee.user.phone,
        sex: online_profile.employee.user.sex,
        avatar: online_profile.employee.user.avatar,
        isMarried: online_profile.employee.isMarried,
        ...online_profile
    };
    let { employee, ...newData } = data;
    return ({
        message: 'Find online profile success',
        status: 200,
        data: newData
    });
};
UserServices.handleGetAttachedDocumentByUser = async (userId) => {
    const attached_document = await attached_documentRepository.findOne({
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
    await attached_documentRepository.createQueryBuilder('att')
        .update()
        .set({
        view: () => "view + 1"
    })
        .execute();
    let data = {
        email: attached_document.employee.user.email,
        name: attached_document.employee.user.name,
        dob: attached_document.employee.user.dob,
        address: attached_document.employee.user.address,
        phone: attached_document.employee.user.phone,
        sex: attached_document.employee.user.sex,
        avatar: attached_document.employee.user.avatar,
        isMarried: attached_document.employee.isMarried,
        ...attached_document
    };
    let { employee, ...newData } = data;
    return ({
        message: 'Find attached document success',
        status: 200,
        data: newData
    });
};
exports.default = UserServices;
//# sourceMappingURL=userServices.js.map