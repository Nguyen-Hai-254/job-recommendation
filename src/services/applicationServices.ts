import { myDataSource } from "../config/connectDB"
import { Employee } from "../entity/Employee"
import { Employer } from "../entity/Employer"
import { User } from "../entity/Users"
import { userRole } from "../utils/enum"
import { JobPosting } from "../entity/JobPosting"
import { Application } from "../entity/Application"
import { AttachedDocument } from "../entity/AttachedDocument"
import { OnlineProfile } from "../entity/OnlineProfile"
import { EnumApplicationType, EnumDegree, EnumEmploymentType, EnumExperience, EnumPositionLevel } from "../utils/enumAction"
import { applicationType } from "../utils/enum"
import moment from "moment"

const userRepository = myDataSource.getRepository(User);
const employerRepository = myDataSource.getRepository(Employer);
const employeeRepository = myDataSource.getRepository(Employee);
const applicationRepository = myDataSource.getRepository(Application);
const jobpostingRepository = myDataSource.getRepository(JobPosting);
const attached_documentRepository = myDataSource.getRepository(AttachedDocument);
const online_profileRepository = myDataSource.getRepository(OnlineProfile);

export default class ApplicationServices {
    static handleCreateNewApplication = async (req) => {
        // Check applicationType and postId
        if (!req?.body?.applicationType || !req?.body?.postId) {
            return ({
                message: 'applicationType and postId are required',
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
        else if (EnumApplicationType(req.body.applicationType) === applicationType.cv_enclosed) {
            if (!req?.body?.CV || !req?.body?.name || !req?.body?.email || !req?.body?.phone) {
                return ({
                    message: 'You choosed application type is cv_enclosed, CV,name,email, phone are required',
                    status: 400,
                    data: null
                })
            }
        }
        else {
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
            CV: req.body.applicationType === 'cv_enclosed' ? req.body.CV : null,
            name: req.body.applicationType === 'cv_enclosed' ? req.body.name : null,
            email: req.body.applicationType === 'cv_enclosed' ? req.body.email : null,
            phone: req.body.applicationType === 'cv_enclosed' ? req.body.phone : null
        })
        const application1 = await applicationRepository.save(application)

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

    static handleGetApplicationsbyEmployee = async (req) => {
        const applications = await employeeRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['applications']
        })

        if (!applications) {
            return ({
                message: `User ${req.user.userId} don't have  any applications`,
                status: 400,
                data: null
            })
        }
        return ({
            message: `Find applications successful!`,
            status: 200,
            data: applications.applications
        })

    }

    static handleGetApplicationsbyEmployer = async (req) => {
        const posts = await jobpostingRepository.find({
            where: { employer: { userId: req.user.userId } },
            relations: ['applications']
        })

        if (!posts) {
            return ({
                message: `User ${req.user.userId} don't have  any jobPosting`,
                status: 400,
                data: null
            })
        }

        const applications = posts.flatMap(post => {
            return post.applications.map(application => ({
                ...application,
                postId: post.postId,
            }));
        });

        return ({
            message: `Find applications successful!`,
            status: 200,
            data: applications
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
    
    static handleUpdateApprovalStatus = async (req) => {
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

        // Update with req.body
        if (req.body?.status) application.status = req.body.status

        await applicationRepository.save(application)

        return ({
            message: `Status of Application has id: ${req.params.id} are changed successfully`,
            status: 200,
            data: application
        })
    }
}

