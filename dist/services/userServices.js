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
    return {
        userId: findEmployer.userId,
        companyName: findEmployer.companyName,
        banner: findEmployer.banner
    };
};
UserServices.handleGetInformationCompanyByUser = async (id) => {
    const getEmployer = await userRepository
        .createQueryBuilder('user')
        .select(['user'])
        .leftJoinAndSelect('user.employer', 'employer')
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
    };
};
UserServices.handleGetAllCompanyByUser = async (reqQuery) => {
    const { num, page } = reqQuery;
    let query = employerRepository.createQueryBuilder('company');
    // Pagination
    query = query.skip((Number(page) - 1) * Number(num)).take(Number(num));
    const [items, totalItems] = await query.getManyAndCount();
    const totalPages = Math.ceil(totalItems / num);
    return {
        items: items,
        meta: {
            totalItems,
            itemCount: items.length,
            itemsPerPage: num,
            totalPages,
            currentPage: page
        }
    };
};
UserServices.handleDeleteUser = async (id) => {
    const user = await userRepository.findOneBy({ userId: id });
    if (!user)
        throw new httpException_1.HttpException(404, "User not found");
    await userRepository.remove(user);
    return user;
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