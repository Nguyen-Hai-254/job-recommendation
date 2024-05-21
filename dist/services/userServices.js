"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const connectDB_1 = require("../config/connectDB");
const entities_1 = require("../entities");
const enum_1 = require("../utils/enum");
const notificationServices_1 = __importDefault(require("./notificationServices"));
const httpException_1 = require("../exceptions/httpException");
const userRepository = connectDB_1.myDataSource.getRepository(entities_1.User);
const employerRepository = connectDB_1.myDataSource.getRepository(entities_1.Employer);
const employeeRepository = connectDB_1.myDataSource.getRepository(entities_1.Employee);
const online_profileRepository = connectDB_1.myDataSource.getRepository(entities_1.OnlineProfile);
const attached_documentRepository = connectDB_1.myDataSource.getRepository(entities_1.AttachedDocument);
class UserServices {
}
_a = UserServices;
UserServices.handleGetProfile = async (user) => {
    var _b;
    const getUserProfile = await userRepository.findOne({
        where: { userId: user.userId },
        relations: ['employee']
    });
    if (!getUserProfile)
        throw new httpException_1.HttpException(404, `This account isn't registered`);
    return {
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
    };
};
UserServices.handleEditProfile = async (user, body) => {
    var _b;
    let findUser = await userRepository.findOne({
        where: { userId: user.userId },
        relations: ['employee']
    });
    if (!findUser)
        throw new httpException_1.HttpException(404, `This account isn't registered`);
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
    await notificationServices_1.default.handleCreateNewNotification(findUser.userId, 'Bạn đã cập nhật thông tin cá nhân');
    return {
        userId: findUser.userId,
        email: findUser.email,
        name: findUser.name,
        dob: (0, moment_1.default)(findUser.dob).format("DD-MM-YYYY"),
        address: findUser.address,
        phone: findUser.phone,
        sex: findUser.sex,
        isMarried: ((_b = findUser.employee) === null || _b === void 0 ? void 0 : _b.isMarried) ? findUser.employee.isMarried : null
    };
};
UserServices.handleGetInformationCompany = async (user) => {
    const getEmployer = await userRepository.findOne({
        where: { userId: user.userId },
        relations: ['employer']
    });
    if (!getEmployer)
        throw new httpException_1.HttpException(404, `user not found`);
    return {
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
    };
};
UserServices.handleEditInformationCompany = async (user, body) => {
    let findEmployer = await userRepository.findOne({
        where: { userId: user.userId },
        relations: ['employer']
    });
    if (!findEmployer)
        throw new httpException_1.HttpException(404, `user not found`);
    if (body.taxCode)
        findEmployer.employer.taxCode = body.taxCode;
    if (body.companyName)
        findEmployer.employer.companyName = body.companyName;
    if (body.companyLocation)
        findEmployer.employer.companyLocation = body.companyLocation;
    if (body.careerField)
        findEmployer.employer.careerField = body.careerField;
    if (body.description)
        findEmployer.employer.description = body.description;
    await employerRepository.save(findEmployer.employer);
    await notificationServices_1.default.handleCreateNewNotification(findEmployer.userId, 'Bạn đã cập nhật thông tin công ty của bạn');
    return {
        userId: findEmployer.userId,
        email: findEmployer.email,
        name: findEmployer.name,
        role: findEmployer.role,
        taxCode: findEmployer.employer.taxCode,
        companyName: findEmployer.employer.companyName,
        companyLocation: findEmployer.employer.companyLocation,
        careerField: findEmployer.employer.careerField,
        description: findEmployer.employer.description
    };
};
UserServices.handleUploadAvatar = async (user, avatar) => {
    let findUser = await userRepository.findOne({
        where: { userId: user.userId }
    });
    if (!findUser)
        throw new httpException_1.HttpException(404, `user not found`);
    findUser.avatar = avatar;
    await userRepository.save(findUser);
    await notificationServices_1.default.handleCreateNewNotification(findUser.userId, 'Bạn đã cập nhật ảnh đại diện');
    return {
        userId: findUser.userId,
        email: findUser.email,
        avatar: findUser.avatar,
        role: findUser.role
    };
};
UserServices.handleUploadLogo = async (user, logo) => {
    let findEmployer = await employerRepository.findOne({
        where: { userId: user.userId }
    });
    if (!findEmployer)
        throw new httpException_1.HttpException(404, `user not found`);
    findEmployer.logo = logo;
    await employerRepository.save(findEmployer);
    await notificationServices_1.default.handleCreateNewNotification(findEmployer.userId, 'Bạn đã cập nhật logo của công ty');
    return {
        userId: findEmployer.userId,
        companyName: findEmployer.companyName,
        avatar: findEmployer.logo
    };
};
UserServices.handleUploadBanner = async (user, banner) => {
    let findEmployer = await employerRepository.findOne({
        where: { userId: user.userId }
    });
    if (!findEmployer)
        throw new httpException_1.HttpException(404, `user not found`);
    findEmployer.banner = banner;
    await employerRepository.save(findEmployer);
    await notificationServices_1.default.handleCreateNewNotification(findEmployer.userId, 'Bạn đã cập nhật banner của công ty');
    return {
        userId: findEmployer.userId,
        companyName: findEmployer.companyName,
        banner: findEmployer.banner
    };
};
UserServices.handleGetInformationCompanyByUser = async (id) => {
    var _b;
    const getEmployer = await userRepository
        .createQueryBuilder('user')
        .select(['user'])
        .leftJoinAndSelect('user.employer', 'employer')
        .leftJoinAndSelect('employer.jobPostings', 'jobPosting', 'jobPosting.status = :status', { status: enum_1.approvalStatus.approved })
        .where('user.userId = :id', { id })
        .getOne();
    if (!getEmployer)
        throw new httpException_1.HttpException(404, `company not found`);
    return {
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
    };
};
UserServices.handleGetAllCompanyByUser = async (num, page) => {
    const skip = (parseInt(page) - 1) * parseInt(num);
    const take = parseInt(num);
    const getEmployer = await employerRepository.find({ skip: skip, take: take });
    const totalCompany = await employerRepository.count({});
    return {
        companyList: getEmployer,
        totalCompany
    };
};
UserServices.handleDeleteUser = async (id) => {
    const user = await userRepository.findOneBy({ userId: id });
    if (!user)
        throw new httpException_1.HttpException(404, "User not found");
    await userRepository.remove(user);
    return user;
};
UserServices.handleGetOnlineProfileByUser = async (userId) => {
    const online_profile = await online_profileRepository.findOne({
        where: { employee: { userId: userId }, isHidden: false },
        relations: ['employee.user', 'another_degrees', 'education_informations', 'work_experiences']
    });
    if (!online_profile)
        throw new httpException_1.HttpException(404, "Online profile not found");
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
    return newData;
};
UserServices.handleGetAttachedDocumentByUser = async (userId) => {
    const attached_document = await attached_documentRepository.findOne({
        where: { employee: { userId: userId }, isHidden: false },
        relations: ['employee.user']
    });
    if (!attached_document)
        throw new httpException_1.HttpException(404, "Attached document not found");
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
    return newData;
};
UserServices.getUserIdByEmail = async (email) => {
    const findUser = await userRepository.findOneBy({ email: email });
    if (!findUser) {
        throw new httpException_1.HttpException(404, 'User not found');
    }
    return findUser.userId;
};
exports.default = UserServices;
//# sourceMappingURL=userServices.js.map