"use strict";
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
ApplicationServices.handleGetApplicationsbyEmployee = async (req) => {
    const applications = await employeeRepository.findOne({
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
};
ApplicationServices.handleGetApplication = async (req) => {
    var _b;
    if (!((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id)) {
        return ({
            message: 'id is required',
            status: 400,
            data: null
        });
    }
    const application = await applicationRepository.findOne({
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
};
ApplicationServices.handleCreateNewApplication = async (req) => {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    // Check applicationType and postId
    if (!((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.applicationType) || !((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.postId)) {
        return ({
            message: 'applicationType and postId are required',
            status: 400,
            data: null
        });
    }
    // Check CV, name, email and phone
    if (!((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.CV) || !((_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.name) || !((_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.email) || !((_g = req === null || req === void 0 ? void 0 : req.body) === null || _g === void 0 ? void 0 : _g.phone)) {
        return ({
            message: 'CV,name,email, phone are required',
            status: 400,
            data: null
        });
    }
    // Check applicationType is correct
    if ((0, enumAction_1.EnumApplicationType)(req.body.applicationType) === enum_1.applicationType.attached_document) {
        const attached_document = await attached_documentRepository.findOne({
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
        const online_profile = await online_profileRepository.findOne({
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
    // Check employee exists
    const employee = await employeeRepository.findOne({
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
    // Check job posting exists
    const job_posting = await jobpostingRepository.findOne({
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
    // Create new application
    const application = await applicationRepository.create({
        applicationType: (0, enumAction_1.EnumApplicationType)(req.body.applicationType),
        CV: req.body.CV,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        keywords: ((_h = req.body) === null || _h === void 0 ? void 0 : _h.keywords) ? (_j = req.body) === null || _j === void 0 ? void 0 : _j.keywords : null,
    });
    const application1 = await applicationRepository.save(application);
    employee.applications.push(application1);
    await employeeRepository.save(employee);
    job_posting.applications.push(application1);
    await jobpostingRepository.save(job_posting);
    return ({
        message: 'Create New Application successfully',
        status: 200,
        data: application
    });
};
ApplicationServices.handleGetApplicationsbyEmployer = async (req) => {
    const { applicationType, name, status, postId, num, page } = req.query;
    // get list of applications by employer
    let query = applicationRepository
        .createQueryBuilder('application')
        .select(['application', 'employee.userId', 'jobPosting.postId'])
        .leftJoin('application.employee', 'employee')
        .leftJoin('application.jobPosting', 'jobPosting')
        .leftJoin('jobPosting.employer', 'employer')
        .where('employer.userId = :userId', { userId: req.user.userId });
    // query by applicationType, name, status, postId
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
    // Pagination
    if (num && page) {
        const skip = (parseInt(page) - 1) * parseInt(num);
        const take = parseInt(num);
        query = query.skip(skip).take(take);
    }
    const applications = await query.getMany();
    return ({
        message: `Find applications successful!`,
        status: 200,
        data: applications
    });
};
ApplicationServices.handleGetLengthOfApplicationsbyEmployer = async (req) => {
    const { applicationType, name, status, postId } = req.query;
    // get list of applications by employer
    let query = applicationRepository
        .createQueryBuilder('application')
        .select(['application', 'employee.userId', 'jobPosting.postId'])
        .leftJoin('application.employee', 'employee')
        .leftJoin('application.jobPosting', 'jobPosting')
        .leftJoin('jobPosting.employer', 'employer')
        .where('employer.userId = :userId', { userId: req.user.userId });
    // query by applicationType, name, status, postId
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
    const totalResults = await query.getCount();
    return ({
        message: `Find applications successful!`,
        status: 200,
        data: { totalResults: totalResults }
    });
};
ApplicationServices.handleGetApplicationbyEmployer = async (req) => {
    var _b;
    if (!((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id)) {
        return ({
            message: 'id is required',
            status: 400,
            data: null
        });
    }
    const application = await applicationRepository.findOne({
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
    // Check employer is owner of application
    const post = await jobpostingRepository.findOne({
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
    // Find information about details of CV with applicationType: cv_enclosed, online-profile, attached-document
    // TH1: cv_enclosed
    if (application.applicationType === enum_1.applicationType.cv_enclosed) {
        return ({
            message: `Find details of Application has id: ${req.params.id} successes`,
            status: 200,
            data: { application }
        });
    }
    // Find personal information about employee of application if applicationType != cv_enclosed
    const user = await userRepository.findOne({
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
    // TH2 : attached_document
    if (application.applicationType === enum_1.applicationType.attached_document) {
        const attached_document = await attached_documentRepository.findOne({
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
    // TH3 : online_profile 
    const online_profile = await online_profileRepository.findOne({
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
};
ApplicationServices.handleUpdateApplicationbyEmployer = async (req) => {
    var _b, _c, _d;
    if (!((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id)) {
        return ({
            message: 'id is required',
            status: 400,
            data: null
        });
    }
    const application = await applicationRepository.findOne({
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
    // Check employer is owner of application
    const post = await jobpostingRepository.findOne({
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
    // Update with req.body
    if ((_c = req.body) === null || _c === void 0 ? void 0 : _c.status)
        application.status = (0, enumAction_1.EnumApprovalStatus)(req.body.status);
    if ((_d = req.body) === null || _d === void 0 ? void 0 : _d.matchingScore)
        application.matchingScore = req.body.matchingScore;
    await applicationRepository.save(application);
    return ({
        message: `Status of Application has id: ${req.params.id} are changed successfully`,
        status: 200,
        data: application
    });
};
ApplicationServices.handleGetAllApplications = async () => {
    const applications = await applicationRepository.find({
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
};
exports.default = ApplicationServices;
//# sourceMappingURL=applicationServices.js.map