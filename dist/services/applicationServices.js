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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const connectDB_1 = require("../config/connectDB");
const Employee_1 = require("../entity/Employee");
const Employer_1 = require("../entity/Employer");
const Users_1 = require("../entity/Users");
const JobPosting_1 = require("../entity/JobPosting");
const Application_1 = require("../entity/Application");
const AttachedDocument_1 = require("../entity/AttachedDocument");
const OnlineProfile_1 = require("../entity/OnlineProfile");
const enumAction_1 = require("../utils/enumAction");
const enum_1 = require("../utils/enum");
const userRepository = connectDB_1.myDataSource.getRepository(Users_1.User);
const employerRepository = connectDB_1.myDataSource.getRepository(Employer_1.Employer);
const employeeRepository = connectDB_1.myDataSource.getRepository(Employee_1.Employee);
const applicationRepository = connectDB_1.myDataSource.getRepository(Application_1.Application);
const jobpostingRepository = connectDB_1.myDataSource.getRepository(JobPosting_1.JobPosting);
const attached_documentRepository = connectDB_1.myDataSource.getRepository(AttachedDocument_1.AttachedDocument);
const online_profileRepository = connectDB_1.myDataSource.getRepository(OnlineProfile_1.OnlineProfile);
class ApplicationServices {
}
_a = ApplicationServices;
ApplicationServices.handleGetApplicationsbyEmployee = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const applications = yield employeeRepository.findOne({
        where: { userId: req.user.userId },
        relations: ['applications', 'applications.jobPosting.employer']
    });
    if (!applications) {
        return ({
            message: `User ${req.user.userId} don't have  any applications`,
            status: 400,
            data: null
        });
    }
    let data = applications.applications.flatMap(application => {
        return {
            application_id: application.application_id,
            applicationType: application.applicationType,
            createAt: application.createAt,
            CV: application.CV,
            name: application.name,
            email: application.email,
            phone: application.phone,
            status: application.status,
            jobTitle: application.jobPosting.jobTitle,
            companyName: application.jobPosting.employer.companyName,
            postId: application.jobPosting.postId,
            applicationDeadline: application.jobPosting.applicationDeadline
        };
    });
    return ({
        message: `Find applications successful!`,
        status: 200,
        data: data
    });
});
ApplicationServices.handleGetApplication = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (!((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id)) {
        return ({
            message: 'id is required',
            status: 400,
            data: null
        });
    }
    const application = yield applicationRepository.findOne({
        where: { application_id: req.params.id },
        relations: ['employee']
    });
    if (!application) {
        return ({
            message: `No Application matches id: ${req.params.id}`,
            status: 400,
            data: null
        });
    }
    return ({
        message: `Find Application has id: ${req.params.id} successes`,
        status: 200,
        data: application
    });
});
ApplicationServices.handleCreateNewApplication = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f, _g, _h, _j, _k;
    if (!((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.applicationType) || !((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.postId)) {
        return ({
            message: 'applicationType and postId are required',
            status: 400,
            data: null
        });
    }
    if (!((_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.CV) || !((_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.name) || !((_g = req === null || req === void 0 ? void 0 : req.body) === null || _g === void 0 ? void 0 : _g.email) || !((_h = req === null || req === void 0 ? void 0 : req.body) === null || _h === void 0 ? void 0 : _h.phone)) {
        return ({
            message: 'CV,name,email, phone are required',
            status: 400,
            data: null
        });
    }
    if ((0, enumAction_1.EnumApplicationType)(req.body.applicationType) === enum_1.applicationType.attached_document) {
        const attached_document = yield attached_documentRepository.findOne({
            where: { userId: req.user.userId }
        });
        if (!attached_document) {
            return ({
                message: 'attached document not found, you need to creat a new attached document',
                status: 400,
                data: null
            });
        }
    }
    else if ((0, enumAction_1.EnumApplicationType)(req.body.applicationType) === enum_1.applicationType.online_profile) {
        const online_profile = yield online_profileRepository.findOne({
            where: { userId: req.user.userId }
        });
        if (!online_profile) {
            return ({
                message: 'online profile not found, you need to creat a new online profile',
                status: 400,
                data: null
            });
        }
    }
    const employee = yield employeeRepository.findOne({
        where: { userId: req.user.userId },
        relations: ['applications']
    });
    if (!employee) {
        return ({
            message: 'Employee not found',
            status: 400,
            data: null
        });
    }
    const job_posting = yield jobpostingRepository.findOne({
        where: { postId: req.body.postId },
        relations: ['applications']
    });
    if (!job_posting) {
        return ({
            message: 'Job posting not found',
            status: 400,
            data: null
        });
    }
    const application = yield applicationRepository.create({
        applicationType: (0, enumAction_1.EnumApplicationType)(req.body.applicationType),
        CV: req.body.CV,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        keywords: ((_j = req.body) === null || _j === void 0 ? void 0 : _j.keywords) ? (_k = req.body) === null || _k === void 0 ? void 0 : _k.keywords : null,
    });
    const application1 = yield applicationRepository.save(application);
    employee.applications.push(application1);
    yield employeeRepository.save(employee);
    job_posting.applications.push(application1);
    yield jobpostingRepository.save(job_posting);
    return ({
        message: 'Create New Application successfully',
        status: 200,
        data: application
    });
});
ApplicationServices.handleGetApplicationsbyEmployer = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { applicationType, name, status, postId, num, page } = req.query;
    let query = applicationRepository
        .createQueryBuilder('application')
        .select(['application', 'employee.userId', 'jobPosting.postId'])
        .leftJoin('application.employee', 'employee')
        .leftJoin('application.jobPosting', 'jobPosting')
        .leftJoin('jobPosting.employer', 'employer')
        .where('employer.userId = :userId', { userId: req.user.userId });
    if (applicationType) {
        query = query.andWhere('application.applicationType = :applicationType', { applicationType });
    }
    if (name) {
        query = query.andWhere('application.name LIKE :name', { name: `%${name}%` });
    }
    if (status) {
        query = query.andWhere('application.status = :status', { status });
    }
    if (postId) {
        query = query.andWhere('application.jobPosting.postId = :postId', { postId });
    }
    if (num && page) {
        const skip = (parseInt(page) - 1) * parseInt(num);
        const take = parseInt(num);
        query = query.skip(skip).take(take);
    }
    const applications = yield query.getMany();
    return ({
        message: `Find applications successful!`,
        status: 200,
        data: applications
    });
});
ApplicationServices.handleGetLengthOfApplicationsbyEmployer = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { applicationType, name, status, postId } = req.query;
    let query = applicationRepository
        .createQueryBuilder('application')
        .select(['application', 'employee.userId', 'jobPosting.postId'])
        .leftJoin('application.employee', 'employee')
        .leftJoin('application.jobPosting', 'jobPosting')
        .leftJoin('jobPosting.employer', 'employer')
        .where('employer.userId = :userId', { userId: req.user.userId });
    if (applicationType) {
        query = query.andWhere('application.applicationType = :applicationType', { applicationType });
    }
    if (name) {
        query = query.andWhere('application.name LIKE :name', { name: `%${name}%` });
    }
    if (status) {
        query = query.andWhere('application.status = :status', { status });
    }
    if (postId) {
        query = query.andWhere('application.jobPosting.postId = :postId', { postId });
    }
    const totalResults = yield query.getCount();
    return ({
        message: `Find applications successful!`,
        status: 200,
        data: { totalResults: totalResults }
    });
});
ApplicationServices.handleGetApplicationbyEmployer = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    if (!((_l = req === null || req === void 0 ? void 0 : req.params) === null || _l === void 0 ? void 0 : _l.id)) {
        return ({
            message: 'id is required',
            status: 400,
            data: null
        });
    }
    const application = yield applicationRepository.findOne({
        where: { application_id: req.params.id },
        relations: ['employee']
    });
    if (!application) {
        return ({
            message: `No Application matches id: ${req.params.id}`,
            status: 400,
            data: null
        });
    }
    const post = yield jobpostingRepository.findOne({
        where: { applications: { application_id: req.params.id } },
        relations: ['applications', 'employer']
    });
    if (!post) {
        return ({
            message: `Find employer is owner of application id: ${req.params.id} failed`,
            status: 400,
            data: null
        });
    }
    if (post.employer.userId !== req.user.userId) {
        return ({
            message: `You isn't owner of application id: ${req.params.id}`,
            status: 400,
            data: null
        });
    }
    if (application.applicationType === enum_1.applicationType.cv_enclosed) {
        return ({
            message: `Find details of Application has id: ${req.params.id} successes`,
            status: 200,
            data: { application }
        });
    }
    const user = yield userRepository.findOne({
        where: { userId: application.employee.userId },
        relations: ['employee']
    });
    if (!user) {
        return ({
            message: `Find personal information of employee of Application has id: ${req.params.id} failures`,
            status: 400,
            data: null
        });
    }
    const personal_information = {
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        dob: user.dob,
        sex: user.sex,
        isMarried: user.employee.isMarried
    };
    if (application.applicationType === enum_1.applicationType.attached_document) {
        const attached_document = yield attached_documentRepository.findOne({
            where: { userId: application.employee.userId }
        });
        if (!attached_document) {
            return ({
                message: `Find attached documet of employee of Application has id: ${req.params.id} failures`,
                status: 400,
                data: null
            });
        }
        return ({
            message: `Find details of Application has id: ${req.params.id} successes`,
            status: 200,
            data: { application, personal_information, attached_document }
        });
    }
    const online_profile = yield online_profileRepository.findOne({
        where: { userId: application.employee.userId },
        relations: ['another_degrees', 'education_informations', 'work_experiences']
    });
    if (!online_profile) {
        return ({
            message: `Find online profile of employee of Application has id: ${req.params.id} failures`,
            status: 400,
            data: null
        });
    }
    return ({
        message: `Find details of Application has id: ${req.params.id} successes`,
        status: 200,
        data: { application, personal_information, online_profile }
    });
});
ApplicationServices.handleUpdateApplicationbyEmployer = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o, _p;
    if (!((_m = req === null || req === void 0 ? void 0 : req.params) === null || _m === void 0 ? void 0 : _m.id)) {
        return ({
            message: 'id is required',
            status: 400,
            data: null
        });
    }
    const application = yield applicationRepository.findOne({
        where: { application_id: req.params.id },
        relations: ['employee']
    });
    if (!application) {
        return ({
            message: `No Application matches id: ${req.params.id}`,
            status: 400,
            data: null
        });
    }
    const post = yield jobpostingRepository.findOne({
        where: { applications: { application_id: req.params.id } },
        relations: ['applications', 'employer']
    });
    if (!post) {
        return ({
            message: `Find employer is owner of application id: ${req.params.id} failed`,
            status: 400,
            data: null
        });
    }
    if (post.employer.userId !== req.user.userId) {
        return ({
            message: `You isn't owner of application id: ${req.params.id}`,
            status: 400,
            data: null
        });
    }
    if ((_o = req.body) === null || _o === void 0 ? void 0 : _o.status)
        application.status = (0, enumAction_1.EnumApprovalStatus)(req.body.status);
    if ((_p = req.body) === null || _p === void 0 ? void 0 : _p.matchingScore)
        application.matchingScore = req.body.matchingScore;
    yield applicationRepository.save(application);
    return ({
        message: `Status of Application has id: ${req.params.id} are changed successfully`,
        status: 200,
        data: application
    });
});
ApplicationServices.handleGetAllApplications = () => __awaiter(void 0, void 0, void 0, function* () {
    const applications = yield applicationRepository.find({
        relations: ['employee']
    });
    if (!applications || applications.length === 0) {
        return ({
            message: 'No Applications found',
            status: 204,
            data: null
        });
    }
    return ({
        message: 'Find AllJobpostings success',
        status: 200,
        data: applications
    });
});
exports.default = ApplicationServices;
//# sourceMappingURL=applicationServices.js.map