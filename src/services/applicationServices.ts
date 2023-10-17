import { myDataSource } from "../config/connectDB"
import { Employee } from "../entity/Employee"
import { Employer } from "../entity/Employer"
import { User, userRole } from "../entity/Users"
import { JobPosting } from "../entity/JobPosting"
import { Application } from "../entity/Application"
import { AttachedDocument } from "../entity/AttachedDocument"
import { OnlineProfile } from "../entity/OnlineProfile"
import { EnumDegree, EnumEmploymentType, EnumExperience, EnumPositionLevel } from "../utils/enumAction"

const userRepository = myDataSource.getRepository(User);
const employerRepository = myDataSource.getRepository(Employer);
const employeeRepository = myDataSource.getRepository(Employee);
const applicationRepository = myDataSource.getRepository(Application);
const jobpostingRepository = myDataSource.getRepository(JobPosting);
const attached_documentRepository = myDataSource.getRepository(AttachedDocument);
const online_profileRepository = myDataSource.getRepository(OnlineProfile);

export default class ApplicationServices {
    static handleCreateNewApplication = async (req) => {
        // Check hasCV and postId
        if (!req?.body?.hasCV || !req?.body?.postId) {
            return ({
                message: 'hasCV and postId are required',
                status: 400,
                data: null
            })
        }
        // Check user is employee ?
        const foundUser = await userRepository.findOne({
            where: { userId: req.user.userId }
        })
        if (!foundUser) {
            return ({
                message: 'User not found',
                status: 400,
                data: null
            })
        }
        if (foundUser.role !== userRole.Employee) {
            return ({
                message: `You aren't a employee, You cannot implement this request`,
                status: 401,
                data: null
            })
        }
        // Check hasCV is correct
        if (req.body.hasCV) {
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
            hasCV: req.body.hasCV
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

    static handleGetApplicationsbyUser = async (req) => {
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
    static handleUpdateStatusAdmin = async (req) => {

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

