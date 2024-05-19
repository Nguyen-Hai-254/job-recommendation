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
const httpException_1 = require("../exceptions/httpException");
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
ApplicationServices.handleGetApplicationsbyEmployee = async (userId) => {
    const applications = await employeeRepository.findOne({
        where: { userId: userId },
        relations: ['applications', 'applications.jobPosting.employer']
    });
    let data = applications === null || applications === void 0 ? void 0 : applications.applications.flatMap(application => {
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
    return data ? data : [];
};
ApplicationServices.handleGetApplication = async (id) => {
    const application = await applicationRepository.findOne({
        where: { application_id: id },
        relations: ['employee']
    });
    if (!application)
        throw new httpException_1.HttpException(404, "Application not found");
    return application;
};
ApplicationServices.handleCreateNewApplication = async (userId, dto) => {
    if (!dto.applicationType || !dto.postId)
        throw new httpException_1.HttpException(400, 'applicationType and postId are required');
    if (!dto.CV || !dto.name || !dto.email || !dto.phone)
        throw new httpException_1.HttpException(400, 'CV,name,email, phone are required');
    // Check applicationType is correct
    if ((0, enumAction_1.EnumApplicationType)(dto.applicationType) === enum_1.applicationType.attached_document) {
        const attached_document = await attached_documentRepository.findOneBy({ userId: userId });
        if (!attached_document)
            throw new httpException_1.HttpException(404, 'attached Document not found');
    }
    else if ((0, enumAction_1.EnumApplicationType)(dto.applicationType) === enum_1.applicationType.online_profile) {
        const online_profile = await online_profileRepository.findOneBy({ userId: userId });
        if (!online_profile)
            throw new httpException_1.HttpException(404, 'online profile not found');
    }
    try {
        // Create new application
        const application = applicationRepository.create({
            applicationType: (0, enumAction_1.EnumApplicationType)(dto.applicationType),
            CV: dto.CV,
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            keywords: dto.keywords ? dto.keywords : null,
            employee: { userId: userId },
            jobPosting: { postId: dto.postId }
        });
        const result = await applicationRepository.save(application);
        return result;
    }
    catch (err) {
        if (err.code === enum_1.MySQLErrorCode.INVALID_RELATION_KEY || err.code === enum_1.MySQLErrorCode.INVALID_RELATION_KEY2) {
            throw new httpException_1.HttpException(404, 'Employee, Job posting Not Found');
        }
        throw err;
    }
};
ApplicationServices.handleGetApplicationsbyEmployer = async (userId, reqQuery) => {
    const { applicationType, name, status, postId, num, page } = reqQuery;
    // get list of applications by employer
    let query = applicationRepository
        .createQueryBuilder('application')
        .select(['application', 'employee.userId', 'jobPosting.postId'])
        .leftJoin('application.employee', 'employee')
        .leftJoin('application.jobPosting', 'jobPosting')
        .leftJoin('jobPosting.employer', 'employer')
        .where('employer.userId = :userId', { userId: userId });
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
    else {
        query = query.skip(0).take(10);
    }
    const applications = await query.getMany();
    return applications ? applications : [];
};
ApplicationServices.handleGetLengthOfApplicationsbyEmployer = async (userId, reqQuery) => {
    const { applicationType, name, status, postId } = reqQuery;
    // get list of applications by employer
    let query = applicationRepository
        .createQueryBuilder('application')
        .select(['application', 'employee.userId', 'jobPosting.postId'])
        .leftJoin('application.employee', 'employee')
        .leftJoin('application.jobPosting', 'jobPosting')
        .leftJoin('jobPosting.employer', 'employer')
        .where('employer.userId = :userId', { userId: userId });
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
    return { totalResults: totalResults };
};
ApplicationServices.handleGetApplicationbyEmployer = async (userId, id) => {
    const application = await applicationRepository.findOne({
        where: { application_id: id },
        relations: ['employee']
    });
    if (!application)
        throw new httpException_1.HttpException(404, 'Application not found');
    // Check employer is owner of application
    const post = await jobpostingRepository.findOne({
        where: { applications: { application_id: id } },
        relations: ['applications', 'employer']
    });
    if (!post)
        throw new httpException_1.HttpException(404, 'Post not found');
    if (post.employer.userId != userId)
        throw new httpException_1.HttpException(403, `You are not the owner of post has id: ${post.postId}`);
    // Find information about details of CV with applicationType: cv_enclosed, online-profile, attached-document
    // TH1: cv_enclosed
    if (application.applicationType === enum_1.applicationType.cv_enclosed) {
        return { application };
    }
    // Find personal information about employee of application if applicationType != cv_enclosed
    const user = await userRepository.findOne({
        where: { userId: application.employee.userId },
        relations: ['employee']
    });
    if (!user)
        throw new httpException_1.HttpException(404, 'Personal information of user not found');
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
        if (!attached_document)
            throw new httpException_1.HttpException(404, 'Not Found attached document');
        return { application, personal_information, attached_document };
    }
    // TH3 : online_profile 
    const online_profile = await online_profileRepository.findOne({
        where: { userId: application.employee.userId },
        relations: ['another_degrees', 'education_informations', 'work_experiences']
    });
    if (!online_profile)
        throw new httpException_1.HttpException(404, 'Not Found online profile');
    return { application, personal_information, online_profile };
};
ApplicationServices.handleUpdateApplicationbyEmployer = async (userId, id, dto) => {
    const application = await applicationRepository.findOne({
        where: { application_id: id },
        relations: ['employee']
    });
    if (!application)
        throw new httpException_1.HttpException(404, 'Application not found');
    // Check employer is owner of application
    const post = await jobpostingRepository.findOne({
        where: { applications: { application_id: id } },
        relations: ['applications', 'employer']
    });
    if (!post)
        throw new httpException_1.HttpException(404, 'Post not found');
    if (post.employer.userId != userId)
        throw new httpException_1.HttpException(403, `You are not the owner of post has id: ${post.postId}`);
    // Update with req.body
    if (dto.status)
        application.status = (0, enumAction_1.EnumApprovalStatus)(dto.status);
    if (dto.matchingScore)
        application.matchingScore = dto.matchingScore;
    await applicationRepository.save(application);
    return application;
};
ApplicationServices.handleGetAllApplications = async () => {
    const applications = await applicationRepository.find({
        relations: ['employee']
    });
    return applications;
};
exports.default = ApplicationServices;
//# sourceMappingURL=applicationServices.js.map