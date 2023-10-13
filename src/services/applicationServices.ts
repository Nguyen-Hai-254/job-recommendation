import { myDataSource } from "../config/connectDB"
import { Employee } from "../entity/Employee"
import { Employer } from "../entity/Employer"
import { User, userRole } from "../entity/Users"
import { Jobposting } from "../entity/Jobposting"
import { Application } from "../entity/Application."
import { employmentType, degree, experience, positionLevel, sex } from "../entity/enum"
import moment from "moment"

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
        if (req.body?.currentPosition) {
            switch (req.body.positionLevel) {
                case 'Quản lí cấp cao':
                    application.currentPosition = positionLevel.ExecutiveManagement;
                    break;
                case 'Quản lí cấp trung':
                    application.currentPosition = positionLevel.MiddleManagement;
                    break;
                case 'Quản lí nhóm-giám sát':
                    application.currentPosition = positionLevel.TeamLeader;
                    break;
                case 'Chuyên gia':
                    application.currentPosition = positionLevel.Specialist;
                    break;
                case 'Cộng tác viên':
                    application.currentPosition = positionLevel.Contributor;
                    break;
                default:
                    application.currentPosition = positionLevel.Employee;
            }
        }
        if (req.body?.desiredPosition) {
            switch (req.body.positionLevel) {
                case 'ExecutiveManagement':
                    application.desiredPosition = positionLevel.ExecutiveManagement;
                    break;
                case 'MiddleManagement':
                    application.desiredPosition = positionLevel.MiddleManagement;
                    break;
                case 'TeamLeader':
                    application.desiredPosition = positionLevel.TeamLeader;
                    break;
                case 'Specialist':
                    application.desiredPosition = positionLevel.Specialist;
                    break;
                case 'Contributor':
                    application.desiredPosition = positionLevel.Contributor;
                    break;
                default:
                    application.desiredPosition = positionLevel.Employee;
            }
        }
        if (req.body?.desiredSalary) application.desiredSalary = req.body?.desiredSalary
        if (req.body?.degree) {
            switch (req.body.degree) {
                case 'highSchool':
                    application.degree = degree.highSchool;
                    break;
                case 'intermediate':
                    application.degree = degree.intermediate;
                    break;
                case 'associate':
                    application.degree = degree.associate;
                    break;
                case 'bachelor':
                    application.degree = degree.bachelor;
                    break;
                case 'doctor':
                    application.degree = degree.doctor;
                    break;
                case 'master':
                    application.degree = degree.master;
                    break;
                default:
                    application.degree = degree.Other;
            }
        }
        if (req.body?.workAddress) application.workAddress = req.body.workAddress
        if (req.body?.experience) {
            switch (req.body.experience) {
                case 'Chưa có kinh nghiệm':
                    application.experience = experience.Zero;
                    break;
                case 'Dưới 1 năm':
                    application.experience = experience.UnderOne;
                    break;
                case '1 năm':
                    application.experience = experience.One;
                    break;
                case '2 năm':
                    application.experience = experience.Two;
                    break;
                case '3 năm':
                    application.experience = experience.Three;
                    break;
                case '4 năm':
                    application.experience = experience.Four;
                    break;
                case '5 năm':
                    application.experience = experience.Five;
                    break;
                default:
                    application.experience = experience.OverFive;
            }
        }
        if (req.body?.employmentType) {
            switch (req.body.employmentType) {
                case 'Toàn thời gian cố định':
                    application.employmentType = employmentType.FulltimePermanent;
                    break;
                case 'Toàn thời gian tạm thời':
                    application.employmentType = employmentType.FulltimeTemporary;
                    break;
                case 'Bán thời gian cố định':
                    application.employmentType = employmentType.ParttimePermanent;
                    break;
                case 'Bán thời gian tạm thời':
                    application.employmentType = employmentType.ParttimeTemporary;
                    break;
                case 'Theo hợp đồng tư vấn':
                    application.employmentType = employmentType.ConsultingContract;
                    break;
                case 'Thực tập':
                    application.employmentType = employmentType.Internship;
                    break;
                default:
                    application.employmentType = employmentType.Other;
            }
        }
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

