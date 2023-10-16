import { myDataSource } from "../config/connectDB"
import { Employee } from "../entity/Employee"
import { Employer } from "../entity/Employer"
import { User, userRole } from "../entity/Users"
import { Jobposting } from "../entity/Jobposting"
import { Application } from "../entity/Application."
import { EnumDegree, EnumEmploymentType, EnumExperience, EnumPositionLevel } from "../utils/enumAction"

const userRepository = myDataSource.getRepository(User);
const employerRepository = myDataSource.getRepository(Employer);
const employeeRepository = myDataSource.getRepository(Employee);
const jobpostingRepository = myDataSource.getRepository(Jobposting);
const applicationRepository = myDataSource.getRepository(Application);

export default class ApplicationServices {
    static handleCreateNewApplication = async (req) => {
        // Check parameters
        if (!req?.body?.jobTitle || !req?.body?.profession || !req?.body?.currentPosition ||
            !req?.body?.desiredPosition || !req?.body?.desiredSalary || !req?.body?.degree ||
            !req?.body?.workAddress || !req?.body?.experience || !req?.body?.employmentType) {
            return ({
                message: 'name is required',
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
        // Create new  application
        const application = await applicationRepository.create({
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
            skills: req.body.skills
        })
        const application1 = await applicationRepository.save(application)

        const user = await employeeRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['applications']
        })

        if (!user) {
            return ({
                message: 'User not found',
                status: 400,
                data: null
            })
        }

        user.applications.push(application1);
        await employeeRepository.save(user);

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
            where: { id: req.params.id },
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
    static handleUpdateApplication = async (req) => {
        if (!req?.params?.id) {
            return ({
                message: 'id is required',
                status: 400,
                data: null
            })
        }

        const application = await applicationRepository.findOne({
            where: { id: req.params.id },
            relations: ['employee']
        })
        if (!application) {
            return ({
                message: `No Application matches id: ${req.params.id}`,
                status: 400,
                data: null
            })
        }

        if (application.employee.userId !== req.user.userId) {
            return ({
                message: `You aren't a owner of jobposting with postId: ${application.id}`,
                status: 403,
                data: null
            })
        }
        // Update with req.body
        if (req.body?.jobTitle) application.jobTitle = req.body.jobTitle
        if (req.body?.profession) application.profession = req.body.profession
        if (req.body?.currentPosition) application.currentPosition = EnumPositionLevel(req.body.currentPosition)
        if (req.body?.desiredPosition) application.desiredPosition = EnumPositionLevel(req.body.desiredPosition)
        if (req.body?.desiredSalary) application.desiredSalary = req.body.desiredSalary
        if (req.body?.degree) application.degree = EnumDegree(req.body.degree)
        if (req.body?.workAddress) application.workAddress = req.body.workAddress
        if (req.body?.experience) application.experience = EnumExperience(req.body.experience);
        if (req.body?.employmentType) application.employmentType = EnumEmploymentType(req.body.employmentType);
        if (req.body?.careerGoal) application.careerGoal = req.body.careerGoal
        if (req.body?.skills) application.skills = req.body.skills

        await applicationRepository.save(application)

        return ({
            message: `Application has id: ${req.params.id} are updated successfully`,
            status: 200,
            data: application
        })

    }
}

