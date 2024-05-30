"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const connectDB_1 = require("../config/connectDB");
const entities_1 = require("../entities");
const enum_1 = require("../utils/enum");
const sort_direction_enum_1 = require("../utils/enums/sort-direction.enum");
const enumAction_1 = require("../utils/enumAction");
const httpException_1 = require("../exceptions/httpException");
const userRepository = connectDB_1.myDataSource.getRepository(entities_1.User);
const applicationRepository = connectDB_1.myDataSource.getRepository(entities_1.Application);
const jobpostingRepository = connectDB_1.myDataSource.getRepository(entities_1.JobPosting);
const attached_documentRepository = connectDB_1.myDataSource.getRepository(entities_1.AttachedDocument);
const online_profileRepository = connectDB_1.myDataSource.getRepository(entities_1.OnlineProfile);
class ApplicationServices {
}
_a = ApplicationServices;
ApplicationServices.handleGetApplicationsbyEmployee = async (userId, reqQuery) => {
    const { num, page } = reqQuery;
    // get list of applications by employee
    let query = applicationRepository
        .createQueryBuilder('application')
        .select([
        'application.application_id', 'application.applicationType', 'application.createAt', 'application.CV', 'application.name', 'application.email', 'application.phone', 'application.status',
        'jobPosting.jobTitle', 'jobPosting.postId', 'jobPosting.applicationDeadline',
        'employer.companyName'
    ])
        .leftJoin('application.employee', 'employee')
        .leftJoin('application.jobPosting', 'jobPosting')
        .leftJoin('jobPosting.employer', 'employer')
        .where('employee.userId = :userId', { userId: userId });
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
    const { applicationType, name, status, postId, num, page, orderBy, sort } = reqQuery;
    // get list of applications by employer
    let query = applicationRepository
        .createQueryBuilder('application')
        .leftJoinAndSelect('application.employee', 'employee')
        .leftJoinAndSelect('employee.online_profile', 'online_profile', 'application.applicationType = :type1', { type1: 'Nộp trực tuyến' })
        .leftJoinAndSelect('online_profile.another_degrees', 'another_degrees')
        .leftJoinAndSelect('online_profile.education_informations', 'education_informations')
        .leftJoinAndSelect('online_profile.work_experiences', 'work_experiences')
        .leftJoinAndSelect('employee.attached_document', 'attached_document', 'application.applicationType = :type2', { type2: 'CV đính kèm' })
        .leftJoin('employee.user', 'user')
        .addSelect(['user.dob', 'user.address', 'user.sex', 'user.avatar'])
        .leftJoin('application.jobPosting', 'jobPosting')
        .addSelect(['jobPosting.jobTitle'])
        .where('jobPosting.employer_id = :userId', { userId: userId });
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
    // sort
    if (orderBy) {
        if (!sort_direction_enum_1.SortDirection.hasOwnProperty(sort))
            throw new httpException_1.HttpException(400, 'Invalid sort');
        switch (orderBy) {
            case 'name':
            case 'matchingScore':
            case 'createAt':
                query = query.orderBy(`application.${orderBy}`, sort);
                break;
            case 'jobTitle':
                query = query.orderBy(`jobPosting.${orderBy}`, sort);
                break;
            default:
                throw new httpException_1.HttpException(400, 'Invalid order by');
        }
    }
    else {
        query = query.orderBy(`application.createAt`, "DESC");
    }
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
    return { ...application, companyName: post.employer.companyName, jobTitle: post.jobTitle };
};
ApplicationServices.handleGetApplicationsByAdmin = async (reqQuery) => {
    const { applicationType, name, status, postId, num, page } = reqQuery;
    // get list of applications by employer
    let query = applicationRepository
        .createQueryBuilder('application')
        .select(['application', 'employee.userId', 'jobPosting.postId'])
        .leftJoin('application.employee', 'employee')
        .leftJoin('application.jobPosting', 'jobPosting')
        .leftJoin('jobPosting.employer', 'employer');
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
exports.default = ApplicationServices;
//# sourceMappingURL=applicationServices.js.map