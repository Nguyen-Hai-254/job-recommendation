import { myDataSource } from "../config/connectDB"
import { Employee } from "../entity/Employee"
import { Employer } from "../entity/Employer"
import { User } from "../entity/Users"
import { JobPosting } from "../entity/JobPosting"
import { Application } from "../entity/Application"
import { AttachedDocument } from "../entity/AttachedDocument"
import { OnlineProfile } from "../entity/OnlineProfile"
import { EnumApplicationType, EnumApprovalStatus } from "../utils/enumAction"
import { applicationType } from "../utils/enum"
import moment from "moment"
import { application } from "express"

const userRepository = myDataSource.getRepository(User);
const employerRepository = myDataSource.getRepository(Employer);
const employeeRepository = myDataSource.getRepository(Employee);
const applicationRepository = myDataSource.getRepository(Application);
const jobpostingRepository = myDataSource.getRepository(JobPosting);
const attached_documentRepository = myDataSource.getRepository(AttachedDocument);
const online_profileRepository = myDataSource.getRepository(OnlineProfile);

export default class ApplicationServices {
    static handleGetApplicationsbyEmployee = async (req) => {
        const applications = await employeeRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['applications', 'applications.jobPosting.employer']
        })

        if (!applications) {
            return ({
                message: `User ${req.user.userId} don't have  any applications`,
                status: 400,
                data: null
            })
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
            }
        })

        return ({
            message: `Find applications successful!`,
            status: 200,
            data: data
        })

    }

    static handleGetApplication = async (req) => {
        if (!req?.params?.id) {
            return ({
                message: 'id is required',
                status: 400,
                data: null
            })
        }
        const application = await applicationRepository.findOne({
            where: { application_id: req.params.id },
            relations: ['employee']
        })
        if (!application) {
            return ({
                message: `No Application matches id: ${req.params.id}`,
                status: 400,
                data: null
            })
        }

        return ({
            message: `Find Application has id: ${req.params.id} successes`,
            status: 200,
            data: application
        })
    }

    static handleCreateNewApplication = async (req) => {
        // Check applicationType and postId
        if (!req?.body?.applicationType || !req?.body?.postId) {
            return ({
                message: 'applicationType and postId are required',
                status: 400,
                data: null
            })
        }
        // Check CV, name, email and phone
        if (!req?.body?.CV || !req?.body?.name || !req?.body?.email || !req?.body?.phone) {
            return ({
                message: 'CV,name,email, phone are required',
                status: 400,
                data: null
            })
        }

        // Check applicationType is correct
        if (EnumApplicationType(req.body.applicationType) === applicationType.attached_document) {
            const attached_document = await attached_documentRepository.findOne({
                where: { userId: req.user.userId }
            })
            if (!attached_document) {
                return ({
                    message: 'attached document not found, you need to creat a new attached document',
                    status: 400,
                    data: null
                })
            }
        }
        else if (EnumApplicationType(req.body.applicationType) === applicationType.online_profile) {
            const online_profile = await online_profileRepository.findOne({
                where: { userId: req.user.userId }
            })
            if (!online_profile) {
                return ({
                    message: 'online profile not found, you need to creat a new online profile',
                    status: 400,
                    data: null
                })
            }
        }


        // Check employee exists
        const employee = await employeeRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['applications']
        })
        if (!employee) {
            return ({
                message: 'Employee not found',
                status: 400,
                data: null
            })
        }
        // Check job posting exists
        const job_posting = await jobpostingRepository.findOne({
            where: { postId: req.body.postId },
            relations: ['applications']
        })
        if (!job_posting) {
            return ({
                message: 'Job posting not found',
                status: 400,
                data: null
            })
        }
        // Create new application
        const application = await applicationRepository.create({
            applicationType: EnumApplicationType(req.body.applicationType),
            CV: req.body.CV,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            keywords: req.body?.keywords ? req.body?.keywords : null,
        })
        const application1 = await applicationRepository.save(application);

        employee.applications.push(application1);
        await employeeRepository.save(employee);

        job_posting.applications.push(application1);
        await jobpostingRepository.save(job_posting);

        return ({
            message: 'Create New Application successfully',
            status: 200,
            data: application
        })
    }

    static handleGetApplicationsbyEmployer = async (req) => {
        const { applicationType, name, status, postId, num, page} = req.query;
        // get list of applications by employer
        let query = applicationRepository
            .createQueryBuilder('application')
            .select(['application', 'employee.userId', 'jobPosting.postId'])
            .leftJoin('application.employee','employee')
            .leftJoin('application.jobPosting', 'jobPosting')
            .leftJoin('jobPosting.employer', 'employer')
            .where('employer.userId = :userId', { userId: req.user.userId });
        // query by applicationType, name, status, postId
        if (applicationType) {
            query = query.andWhere('application.applicationType = :applicationType', { applicationType });
        }
        if (name) {
            query = query.andWhere('application.name LIKE :name', {name : `%${name}%`});
        }
        if (status) {
            query = query.andWhere('application.status = :status', {status});
        }
        if (postId) {
            query = query.andWhere('application.jobPosting.postId = :postId', {postId});
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
        })

    }

    static handleGetLengthOfApplicationsbyEmployer = async (req) => {
        const { applicationType, name, status, postId} = req.query;
        // get list of applications by employer
        let query = applicationRepository
            .createQueryBuilder('application')
            .select(['application', 'employee.userId', 'jobPosting.postId'])
            .leftJoin('application.employee','employee')
            .leftJoin('application.jobPosting', 'jobPosting')
            .leftJoin('jobPosting.employer', 'employer')
            .where('employer.userId = :userId', { userId: req.user.userId });
        // query by applicationType, name, status, postId
        if (applicationType) {
            query = query.andWhere('application.applicationType = :applicationType', { applicationType });
        }
        if (name) {
            query = query.andWhere('application.name LIKE :name', {name : `%${name}%`});
        }
        if (status) {
            query = query.andWhere('application.status = :status', {status});
        }
        if (postId) {
            query = query.andWhere('application.jobPosting.postId = :postId', {postId});
        }
        const totalResults = await query.getCount();

        return ({
            message: `Find applications successful!`,
            status: 200,
            data: {totalResults: totalResults}
        })

    }

    static handleGetApplicationbyEmployer = async (req) => {
        if (!req?.params?.id) {
            return ({
                message: 'id is required',
                status: 400,
                data: null
            })
        }
        const application = await applicationRepository.findOne({
            where: { application_id: req.params.id },
            relations: ['employee']
        })
        if (!application) {
            return ({
                message: `No Application matches id: ${req.params.id}`,
                status: 400,
                data: null
            })
        }
        // Check employer is owner of application
        const post = await jobpostingRepository.findOne({
            where: { applications: { application_id: req.params.id } },
            relations: ['applications', 'employer']
        })
        if (!post) {
            return ({
                message: `Find employer is owner of application id: ${req.params.id} failed`,
                status: 400,
                data: null
            })
        }
        if (post.employer.userId !== req.user.userId) {
            return ({
                message: `You isn't owner of application id: ${req.params.id}`,
                status: 400,
                data: null
            })
        }
        // Find information about details of CV with applicationType: cv_enclosed, online-profile, attached-document
        // TH1: cv_enclosed
        if (application.applicationType === applicationType.cv_enclosed) {
            return ({
                message: `Find details of Application has id: ${req.params.id} successes`,
                status: 200,
                data: { application }
            })
        }
        // Find personal information about employee of application if applicationType != cv_enclosed
        const user = await userRepository.findOne({
            where: { userId: application.employee.userId },
            relations: ['employee']
        })
        if (!user) {
            return ({
                message: `Find personal information of employee of Application has id: ${req.params.id} failures`,
                status: 400,
                data: null
            })
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
        }
        // TH2 : attached_document
        if (application.applicationType === applicationType.attached_document) {
            const attached_document = await attached_documentRepository.findOne({
                where: { userId: application.employee.userId }
            })
            if (!attached_document) {
                return ({
                    message: `Find attached documet of employee of Application has id: ${req.params.id} failures`,
                    status: 400,
                    data: null
                })
            }
            return ({
                message: `Find details of Application has id: ${req.params.id} successes`,
                status: 200,
                data: { application, personal_information, attached_document }
            })
        }
        // TH3 : online_profile 
        const online_profile = await online_profileRepository.findOne({
            where: { userId: application.employee.userId },
            relations: ['another_degrees', 'education_informations', 'work_experiences']
        })
        if (!online_profile) {
            return ({
                message: `Find online profile of employee of Application has id: ${req.params.id} failures`,
                status: 400,
                data: null
            })
        }
        return ({
            message: `Find details of Application has id: ${req.params.id} successes`,
            status: 200,
            data: { application, personal_information, online_profile }
        })

    }

    static handleUpdateApplicationbyEmployer = async (req) => {
        if (!req?.params?.id) {
            return ({
                message: 'id is required',
                status: 400,
                data: null
            })
        }

        const application = await applicationRepository.findOne({
            where: { application_id: req.params.id },
            relations: ['employee']
        })
        if (!application) {
            return ({
                message: `No Application matches id: ${req.params.id}`,
                status: 400,
                data: null
            })
        }
        // Check employer is owner of application
        const post = await jobpostingRepository.findOne({
            where: { applications: { application_id: req.params.id } },
            relations: ['applications', 'employer']
        })
        if (!post) {
            return ({
                message: `Find employer is owner of application id: ${req.params.id} failed`,
                status: 400,
                data: null
            })
        }
        if (post.employer.userId !== req.user.userId) {
            return ({
                message: `You isn't owner of application id: ${req.params.id}`,
                status: 400,
                data: null
            })
        }
        // Update with req.body
        if (req.body?.status) application.status = EnumApprovalStatus(req.body.status)
        if (req.body?.matchingScore) application.matchingScore = req.body.matchingScore

        await applicationRepository.save(application)

        return ({
            message: `Status of Application has id: ${req.params.id} are changed successfully`,
            status: 200,
            data: application
        })
    }

    static handleGetAllApplications = async () => {
        const applications = await applicationRepository.find({
            relations: ['employee']
        })
        if (!applications || applications.length === 0) {
            return ({
                message: 'No Applications found',
                status: 204,
                data: null
            })
        }

        return ({
            message: 'Find AllJobpostings success',
            status: 200,
            data: applications
        })
    }
}

