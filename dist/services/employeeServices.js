"use strict";
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
EmployeeServices.handleGetAttachedDocument = async (req) => {
    const attached_document = await attached_documentRepository.findOne({
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
};
EmployeeServices.handleCreateNewAttachedDocument = async (req) => {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    // Check general information
    if (!((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.jobTitle) || !((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.profession) || !((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.currentPosition) ||
        !((_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.desiredPosition) || !((_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.desiredSalary) || !((_g = req === null || req === void 0 ? void 0 : req.body) === null || _g === void 0 ? void 0 : _g.degree) ||
        !((_h = req === null || req === void 0 ? void 0 : req.body) === null || _h === void 0 ? void 0 : _h.workAddress) || !((_j = req === null || req === void 0 ? void 0 : req.body) === null || _j === void 0 ? void 0 : _j.experience) || !((_k = req === null || req === void 0 ? void 0 : req.body) === null || _k === void 0 ? void 0 : _k.employmentType)) {
        return ({
            message: 'general information is required',
            status: 400,
            data: null
        });
    }
    // Check other information
    if (!((_l = req === null || req === void 0 ? void 0 : req.body) === null || _l === void 0 ? void 0 : _l.CV)) {
        return ({
            message: 'CV is required',
            status: 400,
            data: null
        });
    }
    // Check attached document exists?
    const exist = await attached_documentRepository.findOne({
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
    // Create new  attached document
    const attached_document = await attached_documentRepository.create({
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
    await attached_documentRepository.save(attached_document);
    // add a notification
    const foundUser = await userRepository.findOne({
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
    await notificationRepository.save(createNotification);
    return ({
        message: 'Tạo hồ sơ đính kèm thành công',
        status: 200,
        data: attached_document
    });
};
EmployeeServices.handleUpdateAttachedDocument = async (req) => {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    // Check attached document exists?
    const attached_document = await attached_documentRepository.findOne({
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
    // Update with req.body
    // general information
    if ((_b = req.body) === null || _b === void 0 ? void 0 : _b.jobTitle)
        attached_document.jobTitle = req.body.jobTitle;
    if ((_c = req.body) === null || _c === void 0 ? void 0 : _c.profession)
        attached_document.profession = req.body.profession;
    if ((_d = req.body) === null || _d === void 0 ? void 0 : _d.currentPosition)
        attached_document.currentPosition = (0, enumAction_1.EnumPositionLevel)(req.body.currentPosition);
    if ((_e = req.body) === null || _e === void 0 ? void 0 : _e.desiredPosition)
        attached_document.desiredPosition = (0, enumAction_1.EnumPositionLevel)(req.body.desiredPosition);
    if ((_f = req.body) === null || _f === void 0 ? void 0 : _f.desiredSalary)
        attached_document.desiredSalary = req.body.desiredSalary;
    if ((_g = req.body) === null || _g === void 0 ? void 0 : _g.degree)
        attached_document.degree = (0, enumAction_1.EnumDegree)(req.body.degree);
    if ((_h = req.body) === null || _h === void 0 ? void 0 : _h.workAddress)
        attached_document.workAddress = req.body.workAddress;
    if ((_j = req.body) === null || _j === void 0 ? void 0 : _j.experience)
        attached_document.experience = (0, enumAction_1.EnumExperience)(req.body.experience);
    if ((_k = req.body) === null || _k === void 0 ? void 0 : _k.employmentType)
        attached_document.employmentType = (0, enumAction_1.EnumEmploymentType)(req.body.employmentType);
    if ((_l = req.body) === null || _l === void 0 ? void 0 : _l.careerGoal)
        attached_document.careerGoal = req.body.careerGoal;
    if ((_m = req.body) === null || _m === void 0 ? void 0 : _m.skills)
        attached_document.skills = req.body.skills;
    // other information
    if ((_o = req.body) === null || _o === void 0 ? void 0 : _o.CV)
        attached_document.CV = req.body.CV;
    if (((_p = req.body) === null || _p === void 0 ? void 0 : _p.isHidden) !== null)
        attached_document.isHidden = req.body.isHidden;
    // update keywords
    if ((_q = req.body) === null || _q === void 0 ? void 0 : _q.keywords)
        attached_document.keywords = req.body.keywords;
    await attached_documentRepository.save(attached_document);
    // add a new notification
    const findUser = await userRepository.findOne({
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
    await notificationRepository.save(createNotification);
    return ({
        message: `attached document has userId: ${req.user.userId} are updated successfully`,
        status: 200,
        data: attached_document
    });
};
EmployeeServices.handleGetOnlineProfile = async (req) => {
    const online_profile = await online_profileRepository.findOne({
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
};
EmployeeServices.handleCreateNewOnlineProfile = async (req) => {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    // Check general information
    if (!((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.jobTitle) || !((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.profession) || !((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.currentPosition) ||
        !((_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.desiredPosition) || !((_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.desiredSalary) || !((_g = req === null || req === void 0 ? void 0 : req.body) === null || _g === void 0 ? void 0 : _g.degree) ||
        !((_h = req === null || req === void 0 ? void 0 : req.body) === null || _h === void 0 ? void 0 : _h.workAddress) || !((_j = req === null || req === void 0 ? void 0 : req.body) === null || _j === void 0 ? void 0 : _j.experience) || !((_k = req === null || req === void 0 ? void 0 : req.body) === null || _k === void 0 ? void 0 : _k.employmentType)) {
        return ({
            message: 'general information is required',
            status: 400,
            data: null
        });
    }
    // Check other information
    // Check online profile exists?
    const exist = await online_profileRepository.findOne({
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
    // Create new online profile
    const online_profile = await online_profileRepository.create({
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
        isHidden: ((_l = req === null || req === void 0 ? void 0 : req.body) === null || _l === void 0 ? void 0 : _l.isHidden) ? req.body.isHidden : false
    });
    await online_profileRepository.save(online_profile);
    // add a notification
    const foundUser = await userRepository.findOne({
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
    await notificationRepository.save(createNotification);
    return ({
        message: 'Tạo hồ sơ trực tuyến thành công',
        status: 200,
        data: online_profile
    });
};
EmployeeServices.handleUpdateOnlineProfile = async (req) => {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    // Check online profile exists?
    const online_profile = await online_profileRepository.findOne({
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
    // Update with req.body
    // general information
    if ((_b = req.body) === null || _b === void 0 ? void 0 : _b.jobTitle)
        online_profile.jobTitle = req.body.jobTitle;
    if ((_c = req.body) === null || _c === void 0 ? void 0 : _c.profession)
        online_profile.profession = req.body.profession;
    if ((_d = req.body) === null || _d === void 0 ? void 0 : _d.currentPosition)
        online_profile.currentPosition = (0, enumAction_1.EnumPositionLevel)(req.body.currentPosition);
    if ((_e = req.body) === null || _e === void 0 ? void 0 : _e.desiredPosition)
        online_profile.desiredPosition = (0, enumAction_1.EnumPositionLevel)(req.body.desiredPosition);
    if ((_f = req.body) === null || _f === void 0 ? void 0 : _f.desiredSalary)
        online_profile.desiredSalary = req.body.desiredSalary;
    if ((_g = req.body) === null || _g === void 0 ? void 0 : _g.degree)
        online_profile.degree = (0, enumAction_1.EnumDegree)(req.body.degree);
    if ((_h = req.body) === null || _h === void 0 ? void 0 : _h.workAddress)
        online_profile.workAddress = req.body.workAddress;
    if ((_j = req.body) === null || _j === void 0 ? void 0 : _j.experience)
        online_profile.experience = (0, enumAction_1.EnumExperience)(req.body.experience);
    if ((_k = req.body) === null || _k === void 0 ? void 0 : _k.employmentType)
        online_profile.employmentType = (0, enumAction_1.EnumEmploymentType)(req.body.employmentType);
    if ((_l = req.body) === null || _l === void 0 ? void 0 : _l.careerGoal)
        online_profile.careerGoal = req.body.careerGoal;
    if ((_m = req.body) === null || _m === void 0 ? void 0 : _m.skills)
        online_profile.skills = req.body.skills;
    // other information
    if (((_o = req.body) === null || _o === void 0 ? void 0 : _o.isHidden) !== null)
        online_profile.isHidden = req.body.isHidden;
    else
        online_profile.isHidden = false;
    // update keywords
    if ((_p = req.body) === null || _p === void 0 ? void 0 : _p.keywords)
        online_profile.keywords = req.body.keywords;
    await online_profileRepository.save(online_profile);
    // add a new notification
    const findUser = await userRepository.findOneBy({
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
    await notificationRepository.save(createNotification);
    return ({
        message: `online profile has userId: ${req.user.userId} are updated successfully`,
        status: 200,
        data: online_profile
    });
};
// Update online profile: another degree, education information, work experience
// 1. another degree
EmployeeServices.handleCreateNewAnotherDegree = async (req) => {
    var _b, _c;
    // Check parameters
    if (!((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.degreeName) || !((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.level)) {
        return ({
            message: 'degreeName and level are required',
            status: 400,
            data: null
        });
    }
    // Check online profile exists?
    const online_profile = await online_profileRepository.findOne({
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
    const another_degree = await another_degreeRepository.create({
        degreeName: req.body.degreeName,
        level: req.body.level
    });
    const another_degree1 = await another_degreeRepository.save(another_degree);
    online_profile.another_degrees.push(another_degree1);
    await online_profileRepository.save(online_profile);
    return ({
        message: 'Create New Another Degree successfully',
        status: 200,
        data: online_profile.another_degrees
    });
};
EmployeeServices.handleUpdateAnotherDegree = async (req) => {
    var _b, _c;
    // Check parameters
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of another degree  is required',
            status: 400,
            data: null
        });
    }
    // Check another degree exists?
    const another_degree = await another_degreeRepository.findOne({
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
    // Check employee is owner of another degree ?
    if (another_degree.online_profile.userId !== req.user.userId) {
        return ({
            message: `You are not the owner of another degree has id: ${req.params.id}`,
            status: 403,
            data: null
        });
    }
    if ((_b = req.body) === null || _b === void 0 ? void 0 : _b.degreeName)
        another_degree.degreeName = req.body.degreeName;
    if ((_c = req.body) === null || _c === void 0 ? void 0 : _c.level)
        another_degree.level = req.body.level;
    await another_degreeRepository.save(another_degree);
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
};
EmployeeServices.handleDeleteAnotherDegree = async (req) => {
    // Check parameters
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of another degree  is required',
            status: 400,
            data: null
        });
    }
    // Check another degree exists?
    const another_degree = await another_degreeRepository.findOne({
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
    // Check employee is owner of another degree ?
    if (another_degree.online_profile.userId !== req.user.userId) {
        return ({
            message: `You are not the owner of another degree has id: ${req.params.id}`,
            status: 403,
            data: null
        });
    }
    await another_degreeRepository.delete(another_degree.id);
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
};
// 2. education information
EmployeeServices.handleCreateNewEducationInformation = async (req) => {
    var _b, _c, _d, _e, _f;
    // Check parameters
    if (!((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.schoolName) || !((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.specialization) || !((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.degreeName) ||
        !((_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.startDate) || !((_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.endDate)) {
        return ({
            message: 'schoolName, specialization, degreeName, startDate, endDate are required',
            status: 400,
            data: null
        });
    }
    // Check online profile exists?
    const online_profile = await online_profileRepository.findOne({
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
    const education_information = await education_informationRepository.create({
        schoolName: req.body.schoolName,
        specialization: req.body.specialization,
        degreeName: req.body.degreeName,
        startDate: new Date((0, moment_1.default)(req.body.startDate, "DD-MM-YYYY").format("MM-DD-YYYY")),
        endDate: new Date((0, moment_1.default)(req.body.endDate, "DD-MM-YYYY").format("MM-DD-YYYY"))
    });
    const education_information1 = await education_informationRepository.save(education_information);
    online_profile.education_informations.push(education_information1);
    await online_profileRepository.save(online_profile);
    return ({
        message: 'Create New Education Infomation successfully',
        status: 200,
        data: online_profile.education_informations
    });
};
EmployeeServices.handleUpdateEducationInformation = async (req) => {
    var _b, _c, _d, _e, _f;
    // Check parameters
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of education information  is required',
            status: 400,
            data: null
        });
    }
    // Check education information exists?
    const education_information = await education_informationRepository.findOne({
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
    // Check employee is owner of education information ?
    if (education_information.online_profile.userId !== req.user.userId) {
        return ({
            message: `You are not the owner of education information has id: ${req.params.id}`,
            status: 403,
            data: null
        });
    }
    if ((_b = req.body) === null || _b === void 0 ? void 0 : _b.schoolName)
        education_information.schoolName = req.body.schoolName;
    if ((_c = req.body) === null || _c === void 0 ? void 0 : _c.specialization)
        education_information.specialization = req.body.specialization;
    if ((_d = req.body) === null || _d === void 0 ? void 0 : _d.degreeName)
        education_information.degreeName = req.body.degreeName;
    if ((_e = req.body) === null || _e === void 0 ? void 0 : _e.startDate)
        education_information.startDate = new Date((0, moment_1.default)(req.body.startDate, "DD-MM-YYYY").format("MM-DD-YYYY"));
    if ((_f = req.body) === null || _f === void 0 ? void 0 : _f.endDate)
        education_information.endDate = new Date((0, moment_1.default)(req.body.endDate, "DD-MM-YYYY").format("MM-DD-YYYY"));
    await education_informationRepository.save(education_information);
    return ({
        message: `Update Education information has id: ${req.params.id}  successfully`,
        status: 200,
        data: education_information
    });
};
EmployeeServices.handleDeleteEducationInformation = async (req) => {
    // Check parameters
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of education information  is required',
            status: 400,
            data: null
        });
    }
    // Check education information exists?
    const education_information = await education_informationRepository.findOne({
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
    // Check employee is owner of another degree ?
    if (education_information.online_profile.userId !== req.user.userId) {
        return ({
            message: `You are not the owner of education information has id: ${req.params.id}`,
            status: 403,
            data: null
        });
    }
    await education_informationRepository.delete(education_information.id);
    return ({
        message: `Delete Education Information has id: ${education_information.id}  successfully`,
        status: 200,
        data: education_information
    });
};
// 3. work experience
EmployeeServices.handleCreateNewWorkExperience = async (req) => {
    var _b, _c, _d, _e, _f, _g, _h;
    // Check parameters
    if (!((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.jobTitle) || !((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.companyName) || !((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.jobDescription) ||
        !((_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.startDate) || (!((_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.endDate) && !((_g = req === null || req === void 0 ? void 0 : req.body) === null || _g === void 0 ? void 0 : _g.isDoing))) {
        return ({
            message: 'jobTitle, companyName, jobDescription, startDate, (endDate or isDoing) are required',
            status: 400,
            data: null
        });
    }
    // Check online profile exists?
    const online_profile = await online_profileRepository.findOne({
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
    const work_experience = await work_experienceRepository.create({
        jobTitle: req.body.jobTitle,
        companyName: req.body.companyName,
        jobDescription: req.body.jobDescription,
        startDate: new Date((0, moment_1.default)(req.body.startDate, "DD-MM-YYYY").format("MM-DD-YYYY"))
    });
    if ((_h = req.body) === null || _h === void 0 ? void 0 : _h.isDoing)
        work_experience.isDoing = req.body.isDoing;
    if (!work_experience.isDoing)
        work_experience.endDate = new Date((0, moment_1.default)(req.body.endDate, "DD-MM-YYYY").format("MM-DD-YYYY"));
    const work_experience1 = await work_experienceRepository.save(work_experience);
    online_profile.work_experiences.push(work_experience1);
    await online_profileRepository.save(online_profile);
    return ({
        message: 'Create New Another Degree successfully',
        status: 200,
        data: online_profile.work_experiences
    });
};
EmployeeServices.handleUpdateWorkExperience = async (req) => {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    // Check parameters
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of work experience  is required',
            status: 400,
            data: null
        });
    }
    // Check work experience exists?
    const work_experience = await work_experienceRepository.findOne({
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
    // Check employee is owner of work experience ?
    if (work_experience.online_profile.userId !== req.user.userId) {
        return ({
            message: `You are not the owner of work experience has id: ${req.params.id}`,
            status: 403,
            data: null
        });
    }
    if ((_b = req.body) === null || _b === void 0 ? void 0 : _b.jobTitle)
        work_experience.jobTitle = req.body.jobTitle;
    if ((_c = req.body) === null || _c === void 0 ? void 0 : _c.companyName)
        work_experience.companyName = req.body.companyName;
    if ((_d = req.body) === null || _d === void 0 ? void 0 : _d.jobDescription)
        work_experience.jobDescription = req.body.jobDescription;
    if ((_e = req.body) === null || _e === void 0 ? void 0 : _e.startDate)
        work_experience.startDate = new Date((0, moment_1.default)(req.body.startDate, "DD-MM-YYYY").format("MM-DD-YYYY"));
    // handle isDoing and endDate
    if (((_f = req.body) === null || _f === void 0 ? void 0 : _f.isDoing) && ((_g = req.body) === null || _g === void 0 ? void 0 : _g.endDate)) {
        return ({
            message: `cannot update when body has: isDoing is true and endDate exist`,
            status: 400,
            data: null
        });
    }
    if (((_h = req.body) === null || _h === void 0 ? void 0 : _h.isDoing) && !((_j = req.body) === null || _j === void 0 ? void 0 : _j.endDate)) {
        work_experience.endDate = new Date((0, moment_1.default)(null, "DD-MM-YYYY").format("MM-DD-YYYY"));
        work_experience.isDoing = true;
    }
    if (((_k = req.body) === null || _k === void 0 ? void 0 : _k.isDoing) !== null && ((_l = req.body) === null || _l === void 0 ? void 0 : _l.isDoing) !== undefined && ((_m = req.body) === null || _m === void 0 ? void 0 : _m.isDoing) === false && !((_o = req.body) === null || _o === void 0 ? void 0 : _o.endDate)) {
        return ({
            message: `cannot update when body has: isDoing is false and endDate not exist`,
            status: 400,
            data: null
        });
    }
    if (!((_p = req.body) === null || _p === void 0 ? void 0 : _p.isDoing) && ((_q = req.body) === null || _q === void 0 ? void 0 : _q.endDate)) {
        work_experience.endDate = new Date((0, moment_1.default)(req.body.endDate, "DD-MM-YYYY").format("MM-DD-YYYY"));
        work_experience.isDoing = false;
    }
    await work_experienceRepository.save(work_experience);
    return ({
        message: `Update Work Experience has id: ${req.params.id}  successfully`,
        status: 200,
        data: work_experience
    });
};
EmployeeServices.handleDeleteWorkExperience = async (req) => {
    // Check parameters
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of education information  is required',
            status: 400,
            data: null
        });
    }
    // Check education information exists?
    const work_experience = await work_experienceRepository.findOne({
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
    // Check employee is owner of work experience ?
    if (work_experience.online_profile.userId !== req.user.userId) {
        return ({
            message: `You are not the owner of work experience has id: ${req.params.id}`,
            status: 403,
            data: null
        });
    }
    await work_experienceRepository.delete(work_experience.id);
    return ({
        message: `Delete work experience has id: ${work_experience.id}  successfully`,
        status: 200,
        data: work_experience
    });
};
// Features for employer, admin
EmployeeServices.handleGetEmployeesByAdmin = async (req) => {
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
    // Pagination
    if (num && page) {
        const skip = (parseInt(page) - 1) * parseInt(num);
        const take = parseInt(num);
        query = query.skip(skip).take(take);
    }
    const employees = await query.getMany();
    return ({
        message: 'Get Employees By Admin sucesss',
        status: 200,
        data: employees
    });
};
EmployeeServices.handleGetLengthOfEmployeesByAdmin = async (req) => {
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
    const totalResults = await query.getCount();
    return ({
        message: 'Get Employees By Admin sucesss',
        status: 200,
        data: { totalResults: totalResults }
    });
};
EmployeeServices.handleGetEmployeesByEmployer = async (req) => {
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
    // Public
    if (workAddress) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
    }
    if (jobTitle) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
    }
    if (profession) {
        const professionArray = profession.split(',');
        queryforOnlineProfile = queryforOnlineProfile.andWhere(`(${professionArray.map((keyword) => `online_profile.profession LIKE '%${keyword}%'`).join(' OR ')})`);
        queryforAttachedDocument = queryforAttachedDocument.andWhere(`(${professionArray.map((keyword) => `attached_document.profession LIKE '%${keyword}%'`).join(' OR ')})`);
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
    const lengthOfOnline_profiles = await queryforOnlineProfile.getCount();
    let numOfAttached_documents = 0;
    // Pagination
    if (num && page) {
        // Pagination for Online Profile
        const skip = (parseInt(page) - 1) * parseInt(num);
        const take = parseInt(num);
        queryforOnlineProfile = queryforOnlineProfile.skip(skip).take(take);
        // Pagination for Attached Document
        const numOfOnlineProfile = lengthOfOnline_profiles > skip ? lengthOfOnline_profiles - skip : 0;
        numOfAttached_documents = take > numOfOnlineProfile ? take - numOfOnlineProfile : 0;
        let skip1 = skip > lengthOfOnline_profiles ? skip - lengthOfOnline_profiles : 0;
        queryforAttachedDocument = queryforAttachedDocument.skip(skip1).take(numOfAttached_documents);
    }
    const online_profiles = await queryforOnlineProfile.getMany();
    const attached_documents = numOfAttached_documents ? await queryforAttachedDocument.getMany() : [];
    return ({
        message: 'Get Employees By Employer sucesss',
        status: 200,
        data: [...online_profiles, ...attached_documents]
    });
};
EmployeeServices.handleGetLengthOfEmployeesByEmployer = async (req) => {
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
    // Public
    if (workAddress) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
    }
    if (jobTitle) {
        queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
        queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
    }
    if (profession) {
        const professionArray = profession.split(',');
        queryforOnlineProfile = queryforOnlineProfile.andWhere(`(${professionArray.map((keyword) => `online_profile.profession LIKE '%${keyword}%'`).join(' OR ')})`);
        queryforAttachedDocument = queryforAttachedDocument.andWhere(`(${professionArray.map((keyword) => `attached_document.profession LIKE '%${keyword}%'`).join(' OR ')})`);
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
    const lengthOfOnline_profiles = await queryforOnlineProfile.getCount();
    const lengthOfAttached_profiles = await queryforAttachedDocument.getCount();
    return ({
        message: 'Get Length of Employees By Employer sucesss',
        status: 200,
        data: { lengthOfOnline_profiles, lengthOfAttached_profiles }
    });
};
EmployeeServices.handleGetEmployeesByEmployerSortByKeywords = async (req) => {
    const { keywords, num, page } = req.query;
    if (!keywords || !num || !page) {
        return ({
            message: 'keywords, num, page are not null',
            status: 400,
            data: null
        });
    }
    const sortByKeywords = await sortOnlineProfilesAndAttachedDocumentsByKeyWords(req.query);
    let queryforOnlineProfile = online_profileRepository
        .createQueryBuilder('online_profile')
        .select(['online_profile', 'work_experiences', 'education_informations', 'another_degrees', 'employee.isMarried', 'user.userId', 'user.name', 'user.dob', 'user.address', 'user.sex', 'user.avatar', 'user.email', 'user.phone'])
        .leftJoin('online_profile.work_experiences', 'work_experiences')
        .leftJoin('online_profile.education_informations', 'education_informations')
        .leftJoin('online_profile.another_degrees', 'another_degrees')
        .leftJoin('online_profile.employee', 'employee')
        .leftJoin('employee.user', 'user');
    let queryforAttachedDocument = attached_documentRepository
        .createQueryBuilder('attached_document')
        .select(['attached_document', 'employee.isMarried', 'user.userId', 'user.name', 'user.dob', 'user.address', 'user.sex', 'user.avatar', 'user.email', 'user.phone'])
        .leftJoin('attached_document.employee', 'employee')
        .leftJoin('employee.user', 'user');
    const results = [];
    const lengthOfSortByKeywords = sortByKeywords.result.length;
    for (let i = 0; i < lengthOfSortByKeywords; i++) {
        if (sortByKeywords.result[i].type == '0') {
            let tmp = await queryforOnlineProfile.andWhere('online_profile.userId = :userId', { userId: sortByKeywords.result[i].userId }).getOne();
            results.push(tmp);
        }
        else if (sortByKeywords.result[i].type == '1') {
            let tmp = await queryforAttachedDocument.andWhere('attached_document.userId = :userId', { userId: sortByKeywords.result[i].userId }).getOne();
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
};
EmployeeServices.handleDeleteOnlineProfile = async (req) => {
    // Check parameters
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of online profile is required',
            status: 400,
            data: null
        });
    }
    // Check online profile exists?
    const online_profile = await online_profileRepository.findOne({
        where: { userId: req.params.id },
    });
    if (!online_profile) {
        return ({
            message: `online_profile has id: ${req.params.id} not found`,
            status: 400,
            data: null
        });
    }
    await applicationRepository.delete({
        applicationType: enum_1.applicationType.online_profile,
        employee: { userId: online_profile.userId }
    });
    await online_profileRepository.delete(online_profile.userId);
    return ({
        message: `Delete online profile has id: ${online_profile.userId}  successfully`,
        status: 200,
        data: online_profile
    });
};
EmployeeServices.handleDeleteAttachedDocument = async (req) => {
    // Check parameters
    if (!(req === null || req === void 0 ? void 0 : req.params.id)) {
        return ({
            message: 'id of attached document is required',
            status: 400,
            data: null
        });
    }
    // Check attached document exists?
    const attached_document = await attached_documentRepository.findOne({
        where: { userId: req.params.id },
    });
    if (!attached_document) {
        return ({
            message: `attached_document has id: ${req.params.id} not found`,
            status: 400,
            data: null
        });
    }
    await applicationRepository.delete({
        applicationType: enum_1.applicationType.attached_document,
        employee: { userId: attached_document.userId }
    });
    await attached_documentRepository.delete(attached_document.userId);
    return ({
        message: `Delete work experience has id: ${attached_document.userId}  successfully`,
        status: 200,
        data: attached_document
    });
};
exports.default = EmployeeServices;
async function sortOnlineProfilesAndAttachedDocumentsByKeyWords(reqQuery) {
    const entityManager = connectDB_1.myDataSource.manager;
    const { jobTitle, profession, minSalary, maxSalary, degree, workAddress, experience, employmentType, sex, currentPosition, desiredPosition, keywords, num, page } = reqQuery;
    // TODO: create optional query for user
    let queryforOnlineProfile = ``;
    let queryforAttachedDocument = ``;
    // TODO: left join table user where sex is NOT NULL
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
        // TODO: left join table where sex is NOT NULL
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
    // TODO: profession is a array.    
    if (profession) {
        const professionArray = profession.split(',');
        queryforOnlineProfile += ` AND (${professionArray.map((keyword) => `online_profile.profession LIKE '%${keyword}%'`).join(' OR ')})`;
        queryforAttachedDocument += ` AND (${professionArray.map((keyword) => `attached_document.profession LIKE '%${keyword}%'`).join(' OR ')})`;
    }
    // TODO : default query
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
    // TODO: Total Count
    const onlineProfileCountQuery = `
        SELECT COUNT(*) AS totalCount
        FROM (${onlineProfileQuery}) AS onlineProfiles
    `;
    const attachedDocumentCountQuery = `
        SELECT COUNT(*) AS totalCount
        FROM (${attachedDocumentQuery}) AS attachedDocuments
    `;
    const onlineProfileCountResult = await entityManager.query(onlineProfileCountQuery);
    const attachedDocumentCountResult = await entityManager.query(attachedDocumentCountQuery);
    const totalCount = Number(onlineProfileCountResult[0].totalCount) + Number(attachedDocumentCountResult[0].totalCount);
    // TODO: Query
    const result = await entityManager.query(`
        (${onlineProfileQuery} UNION ${attachedDocumentQuery}) 
        ORDER BY count DESC 
        LIMIT ${parseInt(num)}
        OFFSET ${(parseInt(page) - 1) * parseInt(num)} 
        `);
    return {
        totalCount: totalCount,
        result: result
    };
}
//# sourceMappingURL=employeeServices.js.map