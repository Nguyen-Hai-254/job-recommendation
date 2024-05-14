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
const connectDB_1 = require("../config/connectDB");
const Employee_1 = require("../entity/Employee");
const Employer_1 = require("../entity/Employer");
const Users_1 = require("../entity/Users");
const enum_1 = require("../utils/enum");
const JobPosting_1 = require("../entity/JobPosting");
const Application_1 = require("../entity/Application");
const AttachedDocument_1 = require("../entity/AttachedDocument");
const OnlineProfile_1 = require("../entity/OnlineProfile");
const enumAction_1 = require("../utils/enumAction");
const Notification_1 = require("../entity/Notification");
const AnotherDegree_1 = require("../entity/AnotherDegree");
const EducationInformation_1 = require("../entity/EducationInformation");
const WorkExperience_1 = require("../entity/WorkExperience");
const moment_1 = __importDefault(require("moment"));
const typeorm_1 = require("typeorm");
const userRepository = connectDB_1.myDataSource.getRepository(Users_1.User);
const employerRepository = connectDB_1.myDataSource.getRepository(Employer_1.Employer);
const employeeRepository = connectDB_1.myDataSource.getRepository(Employee_1.Employee);
const jobpostingRepository = connectDB_1.myDataSource.getRepository(JobPosting_1.JobPosting);
const applicationRepository = connectDB_1.myDataSource.getRepository(Application_1.Application);
const attached_documentRepository = connectDB_1.myDataSource.getRepository(AttachedDocument_1.AttachedDocument);
const online_profileRepository = connectDB_1.myDataSource.getRepository(OnlineProfile_1.OnlineProfile);
const notificationRepository = connectDB_1.myDataSource.getRepository(Notification_1.Notification);
const another_degreeRepository = connectDB_1.myDataSource.getRepository(AnotherDegree_1.AnotherDegree);
const education_informationRepository = connectDB_1.myDataSource.getRepository(EducationInformation_1.EducationInformation);
const work_experienceRepository = connectDB_1.myDataSource.getRepository(WorkExperience_1.WorkExperience);
class EmployeeServices {
}
_a = EmployeeServices;
EmployeeServices.handleGetAttachedDocument = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const attached_document = yield attached_documentRepository.findOne({
        where: { employee: { userId: req.user.userId } },
        relations: ['employee']
    });
    if (!attached_document) {
        return ({
            message: 'No attached document found',
            status: 400,
            data: null
        });
    }
    return ({
        message: 'Find attached document success',
        status: 200,
        data: attached_document
    });
});
EmployeeServices.handleCreateNewAttachedDocument = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    if (!((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.jobTitle) || !((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.profession) || !((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.currentPosition) ||
        !((_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.desiredPosition) || !((_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.desiredSalary) || !((_g = req === null || req === void 0 ? void 0 : req.body) === null || _g === void 0 ? void 0 : _g.degree) ||
        !((_h = req === null || req === void 0 ? void 0 : req.body) === null || _h === void 0 ? void 0 : _h.workAddress) || !((_j = req === null || req === void 0 ? void 0 : req.body) === null || _j === void 0 ? void 0 : _j.experience) || !((_k = req === null || req === void 0 ? void 0 : req.body) === null || _k === void 0 ? void 0 : _k.employmentType)) {
        return ({
            message: 'general information is required',
            status: 400,
            data: null
        });
    }
    if (!((_l = req === null || req === void 0 ? void 0 : req.body) === null || _l === void 0 ? void 0 : _l.CV)) {
        return ({
            message: 'CV is required',
            status: 400,
            data: null
        });
    }
    const exist = yield attached_documentRepository.findOne({
        where: { userId: req.user.userId },
        relations: ['employee']
    });
    if (exist) {
        return ({
            message: `Attached document has userId: ${req.user.userId} already exists`,
            status: 400,
            data: null
        });
    }
    const attached_document = yield attached_documentRepository.create({
        userId: req.user.userId,
        jobTitle: req.body.jobTitle,
        profession: req.body.profession,
        currentPosition: req.body.currentPosition,
        desiredPosition: req.body.desiredPosition,
        desiredSalary: req.body.desiredSalary,
        degree: req.body.degree,
        workAddress: req.body.workAddress,
        experience: req.body.experience,
        employmentType: req.body.employmentType,
        careerGoal: req.body.careerGoal,
        skills: req.body.skills,
        CV: req.body.CV,
        view: 0,
        isHidden: ((_m = req === null || req === void 0 ? void 0 : req.body) === null || _m === void 0 ? void 0 : _m.isHidden) ? req.body.isHidden : false
    });
    yield attached_documentRepository.save(attached_document);
    const foundUser = yield userRepository.findOne({
        where: { userId: req.user.userId }
    });
    if (!foundUser) {
        return ({
            message: 'User not found',
            status: 400,
            data: null
        });
    }
    const createNotification = notificationRepository.create({
        content: 'Bạn đã tạo hồ sơ đính kèm',
        user: foundUser
    });
    yield notificationRepository.save(createNotification);
    return ({
        message: 'Tạo hồ sơ đính kèm thành công',
        status: 200,
        data: attached_document
    });
});
EmployeeServices.handleUpdateAttachedDocument = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    const attached_document = yield attached_documentRepository.findOne({
        where: { userId: req.user.userId },
        relations: ['employee']
    });
    if (!attached_document) {
        return ({
            message: `No attached document matches userId: ${req.user.userId}`,
            status: 400,
            data: null
        });
    }
    if ((_o = req.body) === null || _o === void 0 ? void 0 : _o.jobTitle)
        attached_document.jobTitle = req.body.jobTitle;
    if ((_p = req.body) === null || _p === void 0 ? void 0 : _p.profession)
        attached_document.profession = req.body.profession;
    if ((_q = req.body) === null || _q === void 0 ? void 0 : _q.currentPosition)
        attached_document.currentPosition = (0, enumAction_1.EnumPositionLevel)(req.body.currentPosition);
    if ((_r = req.body) === null || _r === void 0 ? void 0 : _r.desiredPosition)
        attached_document.desiredPosition = (0, enumAction_1.EnumPositionLevel)(req.body.desiredPosition);
    if ((_s = req.body) === null || _s === void 0 ? void 0 : _s.desiredSalary)
        attached_document.desiredSalary = req.body.desiredSalary;
    if ((_t = req.body) === null || _t === void 0 ? void 0 : _t.degree)
        attached_document.degree = (0, enumAction_1.EnumDegree)(req.body.degree);
    if ((_u = req.body) === null || _u === void 0 ? void 0 : _u.workAddress)
        attached_document.workAddress = req.body.workAddress;
    if ((_v = req.body) === null || _v === void 0 ? void 0 : _v.experience)
        attached_document.experience = (0, enumAction_1.EnumExperience)(req.body.experience);
    if ((_w = req.body) === null || _w === void 0 ? void 0 : _w.employmentType)
        attached_document.employmentType = (0, enumAction_1.EnumEmploymentType)(req.body.employmentType);
    if ((_x = req.body) === null || _x === void 0 ? void 0 : _x.careerGoal)
        attached_document.careerGoal = req.body.careerGoal;
    if ((_y = req.body) === null || _y === void 0 ? void 0 : _y.skills)
        attached_document.skills = req.body.skills;
    if ((_z = req.body) === null || _z === void 0 ? void 0 : _z.CV)
        attached_document.CV = req.body.CV;
    if (((_0 = req.body) === null || _0 === void 0 ? void 0 : _0.isHidden) !== null)
        attached_document.isHidden = req.body.isHidden;
    if ((_1 = req.body) === null || _1 === void 0 ? void 0 : _1.keywords)
        attached_document.keywords = req.body.keywords;
    yield attached_documentRepository.save(attached_document);
    const findUser = yield userRepository.findOne({
        where: { userId: req.user.userId }
    });
    if (!findUser) {
        return ({
            message: `Không tìm thấy người dùng`,
            status: 400,
            data: null
        });
    }
    const createNotification = notificationRepository.create({
        content: 'Bạn đã cập nhật hồ sơ đính kèm',
        user: findUser
    });
    yield notificationRepository.save(createNotification);
    return ({
        message: `attached document has userId: ${req.user.userId} are updated successfully`,
        status: 200,
        data: attached_document
    });
});
EmployeeServices.handleGetOnlineProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const online_profile = yield online_profileRepository.findOne({
        where: { employee: { userId: req.user.userId } },
        relations: ['employee', 'another_degrees', 'education_informations', 'work_experiences']
    });
    if (!online_profile) {
        return ({
            message: 'No online profile found',
            status: 400,
            data: null
        });
    }
    return ({
        message: 'Find online profile success',
        status: 200,
        data: online_profile
    });
});
EmployeeServices.handleCreateNewOnlineProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _2, _3, _4, _5, _6, _7, _8, _9, _10, _11;
    if (!((_2 = req === null || req === void 0 ? void 0 : req.body) === null || _2 === void 0 ? void 0 : _2.jobTitle) || !((_3 = req === null || req === void 0 ? void 0 : req.body) === null || _3 === void 0 ? void 0 : _3.profession) || !((_4 = req === null || req === void 0 ? void 0 : req.body) === null || _4 === void 0 ? void 0 : _4.currentPosition) ||
        !((_5 = req === null || req === void 0 ? void 0 : req.body) === null || _5 === void 0 ? void 0 : _5.desiredPosition) || !((_6 = req === null || req === void 0 ? void 0 : req.body) === null || _6 === void 0 ? void 0 : _6.desiredSalary) || !((_7 = req === null || req === void 0 ? void 0 : req.body) === null || _7 === void 0 ? void 0 : _7.degree) ||
        !((_8 = req === null || req === void 0 ? void 0 : req.body) === null || _8 === void 0 ? void 0 : _8.workAddress) || !((_9 = req === null || req === void 0 ? void 0 : req.body) === null || _9 === void 0 ? void 0 : _9.experience) || !((_10 = req === null || req === void 0 ? void 0 : req.body) === null || _10 === void 0 ? void 0 : _10.employmentType)) {
        return ({
            message: 'general information is required',
            status: 400,
            data: null
        });
    }
    const exist = yield online_profileRepository.findOne({
        where: { userId: req.user.userId },
        relations: ['employee']
    });
    if (exist) {
        return ({
            message: `Online profile has userId: ${req.user.userId} already exists`,
            status: 400,
            data: null
        });
    }
    const online_profile = yield online_profileRepository.create({
        userId: req.user.userId,
        jobTitle: req.body.jobTitle,
        profession: req.body.profession,
        currentPosition: req.body.currentPosition,
        desiredPosition: req.body.desiredPosition,
        desiredSalary: req.body.desiredSalary,
        degree: req.body.degree,
        workAddress: req.body.workAddress,
        experience: req.body.experience,
        employmentType: req.body.employmentType,
        careerGoal: req.body.careerGoal,
        skills: req.body.skills,
        view: 0,
        isHidden: ((_11 = req === null || req === void 0 ? void 0 : req.body) === null || _11 === void 0 ? void 0 : _11.isHidden) ? req.body.isHidden : false
    });
    yield online_profileRepository.save(online_profile);
    const foundUser = yield userRepository.findOne({
        where: { userId: req.user.userId }
    });
    if (!foundUser) {
        return ({
            message: 'User not found',
            status: 400,
            data: null
        });
    }
    const createNotification = notificationRepository.create({
        content: 'Bạn đã tạo hồ sơ trực tuyến',
        user: foundUser
    });
    yield notificationRepository.save(createNotification);
    return ({
        message: 'Tạo hồ sơ trực tuyến thành công',
        status: 200,
        data: online_profile
    });
});
EmployeeServices.handleUpdateOnlineProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24;
    const online_profile = yield online_profileRepository.findOne({
        where: { userId: req.user.userId },
        relations: ['employee']
    });
    if (!online_profile) {
        return ({
            message: `No online profile matches userId: ${req.user.userId}`,
            status: 400,
            data: null
        });
    }
    if ((_12 = req.body) === null || _12 === void 0 ? void 0 : _12.jobTitle)
        online_profile.jobTitle = req.body.jobTitle;
    if ((_13 = req.body) === null || _13 === void 0 ? void 0 : _13.profession)
        online_profile.profession = req.body.profession;
    if ((_14 = req.body) === null || _14 === void 0 ? void 0 : _14.currentPosition)
        online_profile.currentPosition = (0, enumAction_1.EnumPositionLevel)(req.body.currentPosition);
    if ((_15 = req.body) === null || _15 === void 0 ? void 0 : _15.desiredPosition)
        online_profile.desiredPosition = (0, enumAction_1.EnumPositionLevel)(req.body.desiredPosition);
    if ((_16 = req.body) === null || _16 === void 0 ? void 0 : _16.desiredSalary)
        online_profile.desiredSalary = req.body.desiredSalary;
    if ((_17 = req.body) === null || _17 === void 0 ? void 0 : _17.degree)
        online_profile.degree = (0, enumAction_1.EnumDegree)(req.body.degree);
    if ((_18 = req.body) === null || _18 === void 0 ? void 0 : _18.workAddress)
        online_profile.workAddress = req.body.workAddress;
    if ((_19 = req.body) === null || _19 === void 0 ? void 0 : _19.experience)
        online_profile.experience = (0, enumAction_1.EnumExperience)(req.body.experience);
    if ((_20 = req.body) === null || _20 === void 0 ? void 0 : _20.employmentType)
        online_profile.employmentType = (0, enumAction_1.EnumEmploymentType)(req.body.employmentType);
    if ((_21 = req.body) === null || _21 === void 0 ? void 0 : _21.careerGoal)
        online_profile.careerGoal = req.body.careerGoal;
    if ((_22 = req.body) === null || _22 === void 0 ? void 0 : _22.skills)
        online_profile.skills = req.body.skills;
    if (((_23 = req.body) === null || _23 === void 0 ? void 0 : _23.isHidden) !== null)
        online_profile.isHidden = req.body.isHidden;
    else
        online_profile.isHidden = false;
    if ((_24 = req.body) === null || _24 === void 0 ? void 0 : _24.keywords)
        online_profile.keywords = req.body.keywords;
    yield online_profileRepository.save(online_profile);
    const findUser = yield userRepository.findOneBy({
        userId: req.user.userId
    });
    if (!findUser) {
        return ({
            message: `Không tìm thấy người dùng`,
            status: 400,
            data: null
        });
    }
    const createNotification = notificationRepository.create({
        content: 'Bạn đã cập nhật hồ sơ trực tuyến',
        user: findUser
    });
    yield notificationRepository.save(createNotification);
    return ({
        message: `online profile has userId: ${req.user.userId} are updated successfully`,
        status: 200,
        data: online_profile
    });
});
EmployeeServices.handleCreateNewAnotherDegree = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _25, _26;
    if (!((_25 = req === null || req === void 0 ? void 0 : req.body) === null || _25 === void 0 ? void 0 : _25.degreeName) || !((_26 = req === null || req === void 0 ? void 0 : req.body) === null || _26 === void 0 ? void 0 : _26.level)) {
        return ({
            message: 'degreeName and level are required',
            status: 400,
            data: null
        });
    }
    const online_profile = yield online_profileRepository.findOne({
        where: { userId: req.user.userId },
        relations: ['employee', 'another_degrees']
    });
    if (!online_profile) {
        return ({
            message: `Online profile has userId: ${req.user.userId} doesn't exist`,
            status: 400,
            data: null
        });
    }
    const another_degree = yield another_degreeRepository.create({
        degreeName: req.body.degreeName,
        level: req.body.level
    });
    const another_degree1 = yield another_degreeRepository.save(another_degree);
    online_profile.another_degrees.push(another_degree1);
    yield online_profileRepository.save(online_profile);
    return ({
        message: 'Create New Another Degree successfully',
        status: 200,
        data: online_profile.another_degrees
    });
});
EmployeeServices.handleUpdateAnotherDegree = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _27, _28;
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of another degree  is required',
            status: 400,
            data: null
        });
    }
    const another_degree = yield another_degreeRepository.findOne({
        where: { id: req.params.id },
        relations: ['online_profile']
    });
    if (!another_degree) {
        return ({
            message: `another degree has id: ${req.params.id} not found`,
            status: 400,
            data: null
        });
    }
    if (another_degree.online_profile.userId !== req.user.userId) {
        return ({
            message: `You are not the owner of another degree has id: ${req.params.id}`,
            status: 403,
            data: null
        });
    }
    if ((_27 = req.body) === null || _27 === void 0 ? void 0 : _27.degreeName)
        another_degree.degreeName = req.body.degreeName;
    if ((_28 = req.body) === null || _28 === void 0 ? void 0 : _28.level)
        another_degree.level = req.body.level;
    yield another_degreeRepository.save(another_degree);
    return ({
        message: `Update Another Degree has id: ${req.params.id}  successfully`,
        status: 200,
        data: {
            userId: another_degree.online_profile.userId,
            id: another_degree.id,
            degreeName: another_degree.degreeName,
            level: another_degree.level
        }
    });
});
EmployeeServices.handleDeleteAnotherDegree = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of another degree  is required',
            status: 400,
            data: null
        });
    }
    const another_degree = yield another_degreeRepository.findOne({
        where: { id: req.params.id },
        relations: ['online_profile']
    });
    if (!another_degree) {
        return ({
            message: `another degree has id: ${req.params.id} not found`,
            status: 400,
            data: null
        });
    }
    if (another_degree.online_profile.userId !== req.user.userId) {
        return ({
            message: `You are not the owner of another degree has id: ${req.params.id}`,
            status: 403,
            data: null
        });
    }
    yield another_degreeRepository.delete(another_degree.id);
    return ({
        message: `Delete Another Degree has id: ${another_degree.id}  successfully`,
        status: 200,
        data: {
            userId: another_degree.online_profile.userId,
            id: another_degree.id,
            degreeName: another_degree.degreeName,
            level: another_degree.level
        }
    });
});
EmployeeServices.handleCreateNewEducationInformation = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _29, _30, _31, _32, _33;
    if (!((_29 = req === null || req === void 0 ? void 0 : req.body) === null || _29 === void 0 ? void 0 : _29.schoolName) || !((_30 = req === null || req === void 0 ? void 0 : req.body) === null || _30 === void 0 ? void 0 : _30.specialization) || !((_31 = req === null || req === void 0 ? void 0 : req.body) === null || _31 === void 0 ? void 0 : _31.degreeName) ||
        !((_32 = req === null || req === void 0 ? void 0 : req.body) === null || _32 === void 0 ? void 0 : _32.startDate) || !((_33 = req === null || req === void 0 ? void 0 : req.body) === null || _33 === void 0 ? void 0 : _33.endDate)) {
        return ({
            message: 'schoolName, specialization, degreeName, startDate, endDate are required',
            status: 400,
            data: null
        });
    }
    const online_profile = yield online_profileRepository.findOne({
        where: { userId: req.user.userId },
        relations: ['employee', 'education_informations']
    });
    if (!online_profile) {
        return ({
            message: `Online profile has userId: ${req.user.userId} doesn't exist`,
            status: 400,
            data: null
        });
    }
    const education_information = yield education_informationRepository.create({
        schoolName: req.body.schoolName,
        specialization: req.body.specialization,
        degreeName: req.body.degreeName,
        startDate: new Date((0, moment_1.default)(req.body.startDate, "DD-MM-YYYY").format("MM-DD-YYYY")),
        endDate: new Date((0, moment_1.default)(req.body.endDate, "DD-MM-YYYY").format("MM-DD-YYYY"))
    });
    const education_information1 = yield education_informationRepository.save(education_information);
    online_profile.education_informations.push(education_information1);
    yield online_profileRepository.save(online_profile);
    return ({
        message: 'Create New Education Infomation successfully',
        status: 200,
        data: online_profile.education_informations
    });
});
EmployeeServices.handleUpdateEducationInformation = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _34, _35, _36, _37, _38;
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of education information  is required',
            status: 400,
            data: null
        });
    }
    const education_information = yield education_informationRepository.findOne({
        where: { id: req.params.id },
        relations: ['online_profile']
    });
    if (!education_information) {
        return ({
            message: `education information has id: ${req.params.id} not found`,
            status: 400,
            data: null
        });
    }
    if (education_information.online_profile.userId !== req.user.userId) {
        return ({
            message: `You are not the owner of education information has id: ${req.params.id}`,
            status: 403,
            data: null
        });
    }
    if ((_34 = req.body) === null || _34 === void 0 ? void 0 : _34.schoolName)
        education_information.schoolName = req.body.schoolName;
    if ((_35 = req.body) === null || _35 === void 0 ? void 0 : _35.specialization)
        education_information.specialization = req.body.specialization;
    if ((_36 = req.body) === null || _36 === void 0 ? void 0 : _36.degreeName)
        education_information.degreeName = req.body.degreeName;
    if ((_37 = req.body) === null || _37 === void 0 ? void 0 : _37.startDate)
        education_information.startDate = new Date((0, moment_1.default)(req.body.startDate, "DD-MM-YYYY").format("MM-DD-YYYY"));
    if ((_38 = req.body) === null || _38 === void 0 ? void 0 : _38.endDate)
        education_information.endDate = new Date((0, moment_1.default)(req.body.endDate, "DD-MM-YYYY").format("MM-DD-YYYY"));
    yield education_informationRepository.save(education_information);
    return ({
        message: `Update Education information has id: ${req.params.id}  successfully`,
        status: 200,
        data: education_information
    });
});
EmployeeServices.handleDeleteEducationInformation = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of education information  is required',
            status: 400,
            data: null
        });
    }
    const education_information = yield education_informationRepository.findOne({
        where: { id: req.params.id },
        relations: ['online_profile']
    });
    if (!education_information) {
        return ({
            message: `education information has id: ${req.params.id} not found`,
            status: 400,
            data: null
        });
    }
    if (education_information.online_profile.userId !== req.user.userId) {
        return ({
            message: `You are not the owner of education information has id: ${req.params.id}`,
            status: 403,
            data: null
        });
    }
    yield education_informationRepository.delete(education_information.id);
    return ({
        message: `Delete Education Information has id: ${education_information.id}  successfully`,
        status: 200,
        data: education_information
    });
});
EmployeeServices.handleCreateNewWorkExperience = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _39, _40, _41, _42, _43, _44, _45;
    if (!((_39 = req === null || req === void 0 ? void 0 : req.body) === null || _39 === void 0 ? void 0 : _39.jobTitle) || !((_40 = req === null || req === void 0 ? void 0 : req.body) === null || _40 === void 0 ? void 0 : _40.companyName) || !((_41 = req === null || req === void 0 ? void 0 : req.body) === null || _41 === void 0 ? void 0 : _41.jobDescription) ||
        !((_42 = req === null || req === void 0 ? void 0 : req.body) === null || _42 === void 0 ? void 0 : _42.startDate) || (!((_43 = req === null || req === void 0 ? void 0 : req.body) === null || _43 === void 0 ? void 0 : _43.endDate) && !((_44 = req === null || req === void 0 ? void 0 : req.body) === null || _44 === void 0 ? void 0 : _44.isDoing))) {
        return ({
            message: 'jobTitle, companyName, jobDescription, startDate, (endDate or isDoing) are required',
            status: 400,
            data: null
        });
    }
    const online_profile = yield online_profileRepository.findOne({
        where: { userId: req.user.userId },
        relations: ['employee', 'work_experiences']
    });
    if (!online_profile) {
        return ({
            message: `Online profile has userId: ${req.user.userId} doesn't exist`,
            status: 400,
            data: null
        });
    }
    const work_experience = yield work_experienceRepository.create({
        jobTitle: req.body.jobTitle,
        companyName: req.body.companyName,
        jobDescription: req.body.jobDescription,
        startDate: new Date((0, moment_1.default)(req.body.startDate, "DD-MM-YYYY").format("MM-DD-YYYY"))
    });
    if ((_45 = req.body) === null || _45 === void 0 ? void 0 : _45.isDoing)
        work_experience.isDoing = req.body.isDoing;
    if (!work_experience.isDoing)
        work_experience.endDate = new Date((0, moment_1.default)(req.body.endDate, "DD-MM-YYYY").format("MM-DD-YYYY"));
    const work_experience1 = yield work_experienceRepository.save(work_experience);
    online_profile.work_experiences.push(work_experience1);
    yield online_profileRepository.save(online_profile);
    return ({
        message: 'Create New Another Degree successfully',
        status: 200,
        data: online_profile.work_experiences
    });
});
EmployeeServices.handleUpdateWorkExperience = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59;
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of work experience  is required',
            status: 400,
            data: null
        });
    }
    const work_experience = yield work_experienceRepository.findOne({
        where: { id: req.params.id },
        relations: ['online_profile']
    });
    if (!work_experience) {
        return ({
            message: `Work experience has id: ${req.params.id} not found`,
            status: 400,
            data: null
        });
    }
    if (work_experience.online_profile.userId !== req.user.userId) {
        return ({
            message: `You are not the owner of work experience has id: ${req.params.id}`,
            status: 403,
            data: null
        });
    }
    if ((_46 = req.body) === null || _46 === void 0 ? void 0 : _46.jobTitle)
        work_experience.jobTitle = req.body.jobTitle;
    if ((_47 = req.body) === null || _47 === void 0 ? void 0 : _47.companyName)
        work_experience.companyName = req.body.companyName;
    if ((_48 = req.body) === null || _48 === void 0 ? void 0 : _48.jobDescription)
        work_experience.jobDescription = req.body.jobDescription;
    if ((_49 = req.body) === null || _49 === void 0 ? void 0 : _49.startDate)
        work_experience.startDate = new Date((0, moment_1.default)(req.body.startDate, "DD-MM-YYYY").format("MM-DD-YYYY"));
    if (((_50 = req.body) === null || _50 === void 0 ? void 0 : _50.isDoing) && ((_51 = req.body) === null || _51 === void 0 ? void 0 : _51.endDate)) {
        return ({
            message: `cannot update when body has: isDoing is true and endDate exist`,
            status: 400,
            data: null
        });
    }
    if (((_52 = req.body) === null || _52 === void 0 ? void 0 : _52.isDoing) && !((_53 = req.body) === null || _53 === void 0 ? void 0 : _53.endDate)) {
        work_experience.endDate = new Date((0, moment_1.default)(null, "DD-MM-YYYY").format("MM-DD-YYYY"));
        work_experience.isDoing = true;
    }
    if (((_54 = req.body) === null || _54 === void 0 ? void 0 : _54.isDoing) !== null && ((_55 = req.body) === null || _55 === void 0 ? void 0 : _55.isDoing) !== undefined && ((_56 = req.body) === null || _56 === void 0 ? void 0 : _56.isDoing) === false && !((_57 = req.body) === null || _57 === void 0 ? void 0 : _57.endDate)) {
        return ({
            message: `cannot update when body has: isDoing is false and endDate not exist`,
            status: 400,
            data: null
        });
    }
    if (!((_58 = req.body) === null || _58 === void 0 ? void 0 : _58.isDoing) && ((_59 = req.body) === null || _59 === void 0 ? void 0 : _59.endDate)) {
        work_experience.endDate = new Date((0, moment_1.default)(req.body.endDate, "DD-MM-YYYY").format("MM-DD-YYYY"));
        work_experience.isDoing = false;
    }
    yield work_experienceRepository.save(work_experience);
    return ({
        message: `Update Work Experience has id: ${req.params.id}  successfully`,
        status: 200,
        data: work_experience
    });
});
EmployeeServices.handleDeleteWorkExperience = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of education information  is required',
            status: 400,
            data: null
        });
    }
    const work_experience = yield work_experienceRepository.findOne({
        where: { id: req.params.id },
        relations: ['online_profile']
    });
    if (!work_experience) {
        return ({
            message: `work experience has id: ${req.params.id} not found`,
            status: 400,
            data: null
        });
    }
    if (work_experience.online_profile.userId !== req.user.userId) {
        return ({
            message: `You are not the owner of work experience has id: ${req.params.id}`,
            status: 403,
            data: null
        });
    }
    yield work_experienceRepository.delete(work_experience.id);
    return ({
        message: `Delete work experience has id: ${work_experience.id}  successfully`,
        status: 200,
        data: work_experience
    });
});
EmployeeServices.handleGetEmployeesByAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, profession, num, page } = req.query;
    let query = employeeRepository
        .createQueryBuilder('employee')
        .select(['employee', 'user', 'attached_document', 'online_profile', 'work_experiences', 'education_informations', 'another_degrees'])
        .leftJoin('employee.user', 'user')
        .leftJoin('employee.attached_document', 'attached_document')
        .leftJoin('employee.online_profile', 'online_profile')
        .leftJoin('online_profile.work_experiences', 'work_experiences')
        .leftJoin('online_profile.education_informations', 'education_informations')
        .leftJoin('online_profile.another_degrees', 'another_degrees');
    if (profession) {
        query = query.andWhere(new typeorm_1.Brackets(qb => qb.where('online_profile.profession LIKE :profession', { profession: `%${profession}%` })
            .orWhere('attached_document.profession LIKE :profession', { profession: `%${profession}%` })));
    }
    if (name) {
        query = query.andWhere('user.name LIKE :name', { name: `%${name}%` });
    }
    if (num && page) {
        const skip = (parseInt(page) - 1) * parseInt(num);
        const take = parseInt(num);
        query = query.skip(skip).take(take);
    }
    const employees = yield query.getMany();
    return ({
        message: 'Get Employees By Admin sucesss',
        status: 200,
        data: employees
    });
});
EmployeeServices.handleGetLengthOfEmployeesByAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, profession } = req.query;
    let query = employeeRepository
        .createQueryBuilder('employee')
        .select(['employee', 'user', 'attached_document', 'online_profile', 'work_experiences', 'education_informations', 'another_degrees'])
        .leftJoin('employee.user', 'user')
        .leftJoin('employee.attached_document', 'attached_document')
        .leftJoin('employee.online_profile', 'online_profile')
        .leftJoin('online_profile.work_experiences', 'work_experiences')
        .leftJoin('online_profile.education_informations', 'education_informations')
        .leftJoin('online_profile.another_degrees', 'another_degrees');
    if (profession) {
        query = query.andWhere(new typeorm_1.Brackets(qb => qb.where('online_profile.profession LIKE :profession', { profession: `%${profession}%` })
            .orWhere('attached_document.profession LIKE :profession', { profession: `%${profession}%` })));
    }
    if (name) {
        query = query.andWhere('user.name LIKE :name', { name: `%${name}%` });
    }
    const totalResults = yield query.getCount();
    return ({
        message: 'Get Employees By Admin sucesss',
        status: 200,
        data: { totalResults: totalResults }
    });
});
EmployeeServices.handleGetEmployeesByEmployer = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobTitle, profession, minSalary, maxSalary, degree, workAddress, experience, employmentType, sex, currentPosition, desiredPosition, num, page } = req.query;
    let queryforOnlineProfile = online_profileRepository
        .createQueryBuilder('online_profile')
        .select(['online_profile', 'work_experiences', 'education_informations', 'another_degrees', 'employee.isMarried', 'user.userId', 'user.name', 'user.dob', 'user.address', 'user.sex', 'user.avatar', 'user.phone', 'user.email'])
        .where('online_profile.isHidden = false')
        .leftJoin('online_profile.work_experiences', 'work_experiences')
        .leftJoin('online_profile.education_informations', 'education_informations')
        .leftJoin('online_profile.another_degrees', 'another_degrees')
        .leftJoin('online_profile.employee', 'employee')
        .leftJoin('employee.user', 'user');
    let queryforAttachedDocument = attached_documentRepository
        .createQueryBuilder('attached_document')
        .select(['attached_document', 'employee.isMarried', 'user.userId', 'user.name', 'user.dob', 'user.address', 'user.sex', 'user.avatar', 'user.phone', 'user.email'])
        .where('attached_document.isHidden = false')
        .leftJoin('attached_document.employee', 'employee')
        .leftJoin('employee.user', 'user');
    if (workAddress) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
    }
    if (jobTitle) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
    }
    if (profession) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.profession LIKE :profession', { profession: `%${profession}%` });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.profession LIKE :profession', { profession: `%${profession}%` });
    }
    if (employmentType) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.employmentType = :employmentType', { employmentType });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.employmentType = :employmentType', { employmentType });
    }
    if (degree) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.degree = :degree', { degree });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.degree = :degree', { degree });
    }
    if (experience) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.experience = :experience', { experience });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.experience = :experience', { experience });
    }
    if (sex) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('user.sex = :sex', { sex });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('user.sex = :sex', { sex });
    }
    if (minSalary) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.desiredSalary >= :minSalary', { minSalary });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.desiredSalary >= :minSalary', { minSalary });
    }
    if (maxSalary) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.desiredSalary <= :maxSalary', { maxSalary });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.desiredSalary <= :maxSalary', { maxSalary });
    }
    if (currentPosition) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.currentPosition = :currentPosition', { currentPosition });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.currentPosition = :currentPosition', { currentPosition });
    }
    if (desiredPosition) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.desiredPosition = :desiredPosition', { desiredPosition });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.desiredPosition = :desiredPosition', { desiredPosition });
    }
    const lengthOfOnline_profiles = yield queryforOnlineProfile.getCount();
    let numOfAttached_documents = 0;
    if (num && page) {
        const skip = (parseInt(page) - 1) * parseInt(num);
        const take = parseInt(num);
        queryforOnlineProfile = queryforOnlineProfile.skip(skip).take(take);
        const numOfOnlineProfile = lengthOfOnline_profiles > skip ? lengthOfOnline_profiles - skip : 0;
        numOfAttached_documents = take > numOfOnlineProfile ? take - numOfOnlineProfile : 0;
        let skip1 = skip > lengthOfOnline_profiles ? skip - lengthOfOnline_profiles : 0;
        queryforAttachedDocument = queryforAttachedDocument.skip(skip1).take(numOfAttached_documents);
    }
    const online_profiles = yield queryforOnlineProfile.getMany();
    const attached_documents = numOfAttached_documents ? yield queryforAttachedDocument.getMany() : [];
    return ({
        message: 'Get Employees By Employer sucesss',
        status: 200,
        data: [...online_profiles, ...attached_documents]
    });
});
EmployeeServices.handleGetLengthOfEmployeesByEmployer = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobTitle, profession, minSalary, maxSalary, degree, workAddress, experience, employmentType, sex, currentPosition, desiredPosition } = req.query;
    let queryforOnlineProfile = online_profileRepository
        .createQueryBuilder('online_profile')
        .select(['online_profile', 'work_experiences', 'education_informations', 'another_degrees', 'employee.isMarried', 'user.userId', 'user.name', 'user.dob', 'user.address', 'user.sex', 'user.avatar'])
        .where('online_profile.isHidden = false')
        .leftJoin('online_profile.work_experiences', 'work_experiences')
        .leftJoin('online_profile.education_informations', 'education_informations')
        .leftJoin('online_profile.another_degrees', 'another_degrees')
        .leftJoin('online_profile.employee', 'employee')
        .leftJoin('employee.user', 'user');
    let queryforAttachedDocument = attached_documentRepository
        .createQueryBuilder('attached_document')
        .select(['attached_document', 'employee.isMarried', 'user.userId', 'user.name', 'user.dob', 'user.address', 'user.sex', 'user.avatar'])
        .where('attached_document.isHidden = false')
        .leftJoin('attached_document.employee', 'employee')
        .leftJoin('employee.user', 'user');
    if (workAddress) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
    }
    if (jobTitle) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
    }
    if (profession) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.profession LIKE :profession', { profession: `%${profession}%` });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.profession LIKE :profession', { profession: `%${profession}%` });
    }
    if (employmentType) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.employmentType = :employmentType', { employmentType });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.employmentType = :employmentType', { employmentType });
    }
    if (degree) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.degree = :degree', { degree });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.degree = :degree', { degree });
    }
    if (experience) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.experience = :experience', { experience });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.experience = :experience', { experience });
    }
    if (sex) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('user.sex = :sex', { sex });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('user.sex = :sex', { sex });
    }
    if (minSalary) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.desiredSalary >= :minSalary', { minSalary });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.desiredSalary >= :minSalary', { minSalary });
    }
    if (maxSalary) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.desiredSalary <= :maxSalary', { maxSalary });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.desiredSalary <= :maxSalary', { maxSalary });
    }
    if (currentPosition) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.currentPosition = :currentPosition', { currentPosition });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.currentPosition = :currentPosition', { currentPosition });
    }
    if (desiredPosition) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.desiredPosition = :desiredPosition', { desiredPosition });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.desiredPosition = :desiredPosition', { desiredPosition });
    }
    const lengthOfOnline_profiles = yield queryforOnlineProfile.getCount();
    const lengthOfAttached_profiles = yield queryforAttachedDocument.getCount();
    return ({
        message: 'Get Length of Employees By Employer sucesss',
        status: 200,
        data: { lengthOfOnline_profiles, lengthOfAttached_profiles }
    });
});
EmployeeServices.handleGetEmployeesByEmployerSortByKeywords = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { keywords, num, page } = req.query;
    if (!keywords || !num || !page) {
        return ({
            message: 'keywords, num, page are not null',
            status: 400,
            data: null
        });
    }
    const sortByKeywords = yield sortOnlineProfilesAndAttachedDocumentsByKeyWords(req.query);
    let queryforOnlineProfile = online_profileRepository
        .createQueryBuilder('online_profile')
        .select(['online_profile', 'work_experiences', 'education_informations', 'another_degrees', 'employee.isMarried', 'user.userId', 'user.name', 'user.dob', 'user.address', 'user.sex', 'user.avatar'])
        .leftJoin('online_profile.work_experiences', 'work_experiences')
        .leftJoin('online_profile.education_informations', 'education_informations')
        .leftJoin('online_profile.another_degrees', 'another_degrees')
        .leftJoin('online_profile.employee', 'employee')
        .leftJoin('employee.user', 'user');
    let queryforAttachedDocument = attached_documentRepository
        .createQueryBuilder('attached_document')
        .select(['attached_document', 'employee.isMarried', 'user.userId', 'user.name', 'user.dob', 'user.address', 'user.sex', 'user.avatar'])
        .leftJoin('attached_document.employee', 'employee')
        .leftJoin('employee.user', 'user');
    const results = [];
    const lengthOfSortByKeywords = sortByKeywords.result.length;
    for (let i = 0; i < lengthOfSortByKeywords; i++) {
        if (sortByKeywords.result[i].type == '0') {
            let tmp = yield queryforOnlineProfile.andWhere('online_profile.userId = :userId', { userId: sortByKeywords.result[i].userId }).getOne();
            results.push(tmp);
        }
        else if (sortByKeywords.result[i].type == '1') {
            let tmp = yield queryforAttachedDocument.andWhere('attached_document.userId = :userId', { userId: sortByKeywords.result[i].userId }).getOne();
            results.push(tmp);
        }
    }
    return ({
        message: 'Get Employees By Employer sort by keywords sucesss',
        status: 200,
        data: {
            totalCount: sortByKeywords.totalCount,
            result: results
        }
    });
});
EmployeeServices.handleDeleteOnlineProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of online profile is required',
            status: 400,
            data: null
        });
    }
    const online_profile = yield online_profileRepository.findOne({
        where: { userId: req.params.id },
    });
    if (!online_profile) {
        return ({
            message: `online_profile has id: ${req.params.id} not found`,
            status: 400,
            data: null
        });
    }
    yield applicationRepository.delete({
        applicationType: enum_1.applicationType.online_profile,
        employee: { userId: online_profile.userId }
    });
    yield online_profileRepository.delete(online_profile.userId);
    return ({
        message: `Delete online profile has id: ${online_profile.userId}  successfully`,
        status: 200,
        data: online_profile
    });
});
EmployeeServices.handleDeleteAttachedDocument = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of attached document is required',
            status: 400,
            data: null
        });
    }
    const attached_document = yield attached_documentRepository.findOne({
        where: { userId: req.params.id },
    });
    if (!attached_document) {
        return ({
            message: `attached_document has id: ${req.params.id} not found`,
            status: 400,
            data: null
        });
    }
    yield applicationRepository.delete({
        applicationType: enum_1.applicationType.attached_document,
        employee: { userId: attached_document.userId }
    });
    yield attached_documentRepository.delete(attached_document.userId);
    return ({
        message: `Delete work experience has id: ${attached_document.userId}  successfully`,
        status: 200,
        data: attached_document
    });
});
exports.default = EmployeeServices;
function sortOnlineProfilesAndAttachedDocumentsByKeyWords(reqQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        const entityManager = connectDB_1.myDataSource.manager;
        const { jobTitle, profession, minSalary, maxSalary, degree, workAddress, experience, employmentType, sex, currentPosition, desiredPosition, keywords, num, page } = reqQuery;
        let queryforOnlineProfile = ``;
        let queryforAttachedDocument = ``;
        let leftjoinforOnlineProfile = ``;
        let leftjoinforAttachedDocument = ``;
        if (workAddress) {
            queryforOnlineProfile += ` AND online_profile.workAddress LIKE '%${workAddress}%'`;
            queryforAttachedDocument += ` AND attached_document.workAddress LIKE '%${workAddress}%'`;
        }
        if (jobTitle) {
            queryforOnlineProfile += ` AND online_profile.jobTitle LIKE '%${jobTitle}%'`;
            queryforAttachedDocument += ` AND attached_document.jobTitle LIKE '%${jobTitle}%`;
        }
        if (profession) {
            queryforOnlineProfile += ` AND online_profile.profession LIKE '%${profession}%'`;
            queryforAttachedDocument += ` AND attached_document.profession LIKE '%${profession}%'`;
        }
        if (employmentType) {
            queryforOnlineProfile += ` AND online_profile.employmentType = '${employmentType}'`;
            queryforAttachedDocument += ` AND attached_document.employmentType = '${employmentType}'`;
        }
        if (degree) {
            queryforOnlineProfile += ` AND online_profile.degree = '${degree}'`;
            queryforAttachedDocument += ` AND attached_document.degree = '${degree}'`;
        }
        if (experience) {
            queryforOnlineProfile += ` AND online_profile.experience = '${experience}'`;
            queryforAttachedDocument += ` AND attached_document.experience = '${experience}'`;
        }
        if (sex) {
            queryforOnlineProfile += ` AND user.sex = '${sex}'`;
            queryforAttachedDocument += ` AND user.sex = '${sex}'`;
            leftjoinforOnlineProfile = `
        LEFT JOIN employee
        ON employee.userId = online_profile.userId  
        LEFT JOIN user 
        ON user.userId = employee.userId
        `;
            leftjoinforAttachedDocument = ` 
        LEFT JOIN employee
        ON employee.userId = attached_document.userId  
        LEFT JOIN user 
        ON user.userId = employee.userId
        `;
        }
        if (minSalary) {
            queryforOnlineProfile += ` AND online_profile.desiredSalary >= '${minSalary}'`;
            queryforAttachedDocument += ` AND attached_document.desiredSalary >= '${minSalary}'`;
        }
        if (maxSalary) {
            queryforOnlineProfile += ` AND online_profile.desiredSalary <= '${maxSalary}'`;
            queryforAttachedDocument += ` AND attached_document.desiredSalary <= '${maxSalary}'`;
        }
        if (currentPosition) {
            queryforOnlineProfile += ` AND online_profile.currentPosition = '${currentPosition}'`;
            queryforAttachedDocument += ` AND attached_document.currentPosition = '${currentPosition}'`;
        }
        if (desiredPosition) {
            queryforOnlineProfile += ` AND online_profile.desiredPosition = '${desiredPosition}'`;
            queryforAttachedDocument += ` AND attached_document.desiredPosition = '${desiredPosition}'`;
        }
        const keywordArray = keywords.split(',');
        const onlineProfileQuery = `
        SELECT 
            online_profile.userId AS userId, 
            0 AS type,
            (${keywordArray.map((keyword) => `CASE WHEN online_profile.keywords LIKE '%${keyword}%' THEN 1 ELSE 0 END`).join(' + ')}) AS count
        FROM online_profile
        ${leftjoinforOnlineProfile}
        WHERE online_profile.isHidden = false
        ${queryforOnlineProfile}
        HAVING count > 0
    `;
        const attachedDocumentQuery = `
        SELECT 
            attached_document.userId AS userId, 
            1 AS type,
            (${keywordArray.map((keyword) => `CASE WHEN attached_document.keywords LIKE '%${keyword}%' THEN 1 ELSE 0 END`).join(' + ')}) AS count
        FROM attached_document
        ${leftjoinforAttachedDocument}
        WHERE attached_document.isHidden = false
        ${queryforAttachedDocument}
        HAVING count > 0
    `;
        const onlineProfileCountQuery = `
        SELECT COUNT(*) AS totalCount
        FROM (${onlineProfileQuery}) AS onlineProfiles
    `;
        const attachedDocumentCountQuery = `
        SELECT COUNT(*) AS totalCount
        FROM (${attachedDocumentQuery}) AS attachedDocuments
    `;
        const onlineProfileCountResult = yield entityManager.query(onlineProfileCountQuery);
        const attachedDocumentCountResult = yield entityManager.query(attachedDocumentCountQuery);
        const totalCount = Number(onlineProfileCountResult[0].totalCount) + Number(attachedDocumentCountResult[0].totalCount);
        const result = yield entityManager.query(`
        (${onlineProfileQuery} UNION ${attachedDocumentQuery}) 
        ORDER BY count DESC 
        LIMIT ${parseInt(num)}
        OFFSET ${(parseInt(page) - 1) * parseInt(num)} 
        `);
        return {
            totalCount: totalCount,
            result: result
        };
    });
}
//# sourceMappingURL=employeeServices.js.map