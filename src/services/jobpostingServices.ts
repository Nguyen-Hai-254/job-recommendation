import { myDataSource } from "../config/connectDB"
import { Employee } from "../entity/Employee"
import { Employer } from "../entity/Employer"
import { User, userRole } from "../entity/Users"
import { Jobposting } from "../entity/Jobposting"
import { employmentType, degree, experience, positionLevel, sex } from "../entity/enum"
import moment from "moment"

const userRepository = myDataSource.getRepository(User);
const employerRepository = myDataSource.getRepository(Employer);
const employeeRepository = myDataSource.getRepository(Employee);
const jobpostingRepository = myDataSource.getRepository(Jobposting);

export default class JobpostingServices {
    static handleGetAllJobpostings = async () => {
        const jobpostings = await jobpostingRepository.find({
            relations: ['employer']
        })
        if (!jobpostings || jobpostings.length === 0) {
            return ({
                message: 'No Jobpostings found',
                status: 204,
                data: null
            })
        }

        return ({
            message: 'Find AllJobpostings success',
            status: 200,
            data: jobpostings
        })
    }
    static handleGetJobpostingsbyUser = async (req) => {
        const getJobpostings = await employerRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['jobpostings']
        })

        if (!getJobpostings) {
            return ({
                message: `User ${req.user.userId} don't have  any job posting`,
                status: 400,
                data: null
            })
        }
        return ({
            message: `Find jobpostings successful!`,
            status: 200,
            data: getJobpostings.jobpostings
        })

    }

    static handleGetJobposting = async (req) => {
        if (!req?.params?.postId) {
            return ({
                message: 'postId is required',
                status: 400,
                data: null
            })
        }
        const jobposting = await jobpostingRepository.findOne({
            where: { postId: req.params.postId },
            relations: ['employer']
        })
        if (!jobposting) {
            return ({
                message: `No Job posting matches postId: ${req.params.postId}`,
                status: 400,
                data: null
            })
        }

        return ({
            message: `Find Job posting has postId: ${req.params.postId} successes`,
            status: 200,
            data: jobposting
        })
    }

    static handleUpdateJobPosting = async (req) => {
        if (!req?.params?.postId) {
            return ({
                message: 'postId is required',
                status: 400,
                data: null
            })
        }

        const jobposting = await jobpostingRepository.findOne({
            where: { postId: req.params.postId },
            relations: ['employer']
        })
        if (!jobposting) {
            return ({
                message: `No Job posting matches postId: ${req.params.postId}`,
                status: 400,
                data: null
            })
        }

        if (jobposting.employer.userId !== req.user.userId) {
            return ({
                message: `You aren't a owner of jobposting with postId: ${jobposting.postId}`,
                status: 401,
                data: null
            })
        }
        // Update with req.body
        if (req.body?.name) jobposting.name = req.body.name
        if (req.body?.email) jobposting.email = req.body.email
        if (req.body?.phone) jobposting.phone = req.body.phone
        if (req.body?.contactAddress) jobposting.contactAddress = req.body.contactAddress
        if (req.body?.workAddress) jobposting.workAddress = req.body.workAddress

        if (req.body?.jobTitle) jobposting.jobTitle = req.body.jobTitle
        if (req.body?.profession) jobposting.profession = req.body.profession
        if (req.body?.employmentType) {
            switch (req.body.employmentType) {
                case 'Toàn thời gian cố định':
                    jobposting.employmentType = employmentType.FulltimePermanent;
                    break;
                case 'Toàn thời gian tạm thời':
                    jobposting.employmentType = employmentType.FulltimeTemporary;
                    break;
                case 'Bán thời gian cố định':
                    jobposting.employmentType = employmentType.ParttimePermanent;
                    break;
                case 'Bán thời gian tạm thời':
                    jobposting.employmentType = employmentType.ParttimeTemporary;
                    break;
                case 'Theo hợp đồng tư vấn':
                    jobposting.employmentType = employmentType.ConsultingContract;
                    break;
                case 'Thực tập':
                    jobposting.employmentType = employmentType.Internship;
                    break;
                default:
                    jobposting.employmentType = employmentType.Other;
            }
        }
        if (req.body?.degree) {
            switch (req.body.degree) {
                case 'highSchool':
                    jobposting.degree = degree.highSchool;
                    break;
                case 'intermediate':
                    jobposting.degree = degree.intermediate;
                    break;
                case 'associate':
                    jobposting.degree = degree.associate;
                    break;
                case 'bachelor':
                    jobposting.degree = degree.bachelor;
                    break;
                case 'doctor':
                    jobposting.degree = degree.doctor;
                    break;
                case 'master':
                    jobposting.degree = degree.master;
                    break;
                default:
                    jobposting.degree = degree.Other;
            }
        }
        if (req.body?.experience) {
            switch (req.body.experience) {
                case 'Chưa có kinh nghiệm':
                    jobposting.experience = experience.Zero;
                    break;
                case 'Dưới 1 năm':
                    jobposting.experience = experience.UnderOne;
                    break;
                case '1 năm':
                    jobposting.experience = experience.One;
                    break;
                case '2 năm':
                    jobposting.experience = experience.Two;
                    break;
                case '3 năm':
                    jobposting.experience = experience.Three;
                    break;
                case '4 năm':
                    jobposting.experience = experience.Four;
                    break;
                case '5 năm':
                    jobposting.experience = experience.Five;
                    break;
                default:
                    jobposting.experience = experience.OverFive;
            }
        }
        if (req.body?.positionLevel) {
            switch (req.body.positionLevel) {
                case 'Quản lí cấp cao':
                    jobposting.positionLevel = positionLevel.ExecutiveManagement;
                    break;
                case 'Quản lí cấp trung':
                    jobposting.positionLevel = positionLevel.MiddleManagement;
                    break;
                case 'Quản lí nhóm-giám sát':
                    jobposting.positionLevel = positionLevel.TeamLeader;
                    break;
                case 'Chuyên gia':
                    jobposting.positionLevel = positionLevel.Specialist;
                    break;
                case 'Cộng tác viên':
                    jobposting.positionLevel = positionLevel.Contributor;
                    break;
                default:
                    jobposting.positionLevel = positionLevel.Employee;
            }
        }
        if (req.body?.minAge) jobposting.minAge = req.body.minAge
        if (req.body?.maxAge) jobposting.maxAge = req.body.maxAge
        if (req.body?.sex) {
            switch (req.body.sex) {
                case 'Nam':
                    jobposting.sex = sex.Male;
                    break;
                case 'Nữ':
                    jobposting.sex = sex.Female;
                    break;
                default:
                    jobposting.sex = sex.Other

            }
        }
        if (req.body?.numberofVacancies) jobposting.numberofVacancies = req.body.numberofVacancies
        if (req.body?.trialPeriod) jobposting.trialPeriod = req.body.trialPeriod
        if (req.body?.applicationDeadline) jobposting.applicationDeadline = new Date(moment(req.body.applicationDeadline, "DD-MM-YYYY").format("MM-DD-YYYY"));
        if (req.body?.minSalary) jobposting.minSalary = req.body.minSalary
        if (req.body?.maxSalary) jobposting.maxSalary = req.body.maxSalary
        if (req.body?.skills) jobposting.skills = req.body.skills
        if (req.body?.jobDescription) jobposting.jobDescription = req.body.jobDescription
        if (req.body?.jobRequirements) jobposting.jobRequirements = req.body.jobRequirements
        if (req.body?.benefits) jobposting.benefits = req.body.benefits

        await jobpostingRepository.save(jobposting)

        return ({
            message: `Job posting has postId: ${req.params.postId} are updated successfully`,
            status: 200,
            data: jobposting
        })

    }
    static handleCreateNewJobposting = async (req) => {
        // Check parameters
        if (!req?.body?.name || !req?.body?.email || !req?.body?.phone || !req?.body?.contactAddress) {
            return ({
                message: 'Thông tin liên hệ còn thiếu',
                status: 400,
                data: null
            })
        }
        if (!req?.body?.jobTitle || !req?.body?.profession || !req?.body?.employmentType || !req?.body?.degree || !req?.body?.experience ||
            !req?.body?.positionLevel || !req?.body?.numberofVacancies || !req?.body?.applicationDeadline) {
            return ({
                message: 'Thông tin cơ bản còn thiếu',
                status: 400,
                data: null
            })
        }
        if (!req?.body?.workAddress || !req?.body?.minSalary || !req?.body?.maxSalary) {
            return ({
                message: 'Thông tin địa chỉ làm việc hoặc mức lương còn thiếu',
                status: 400,
                data: null
            })
        }
        if (!req?.body?.jobDescription || !req?.body?.jobRequirements || !req?.body?.benefits) {
            return ({
                message: 'Mô tả công việc còn thiếu',
                status: 400,
                data: null
            })
        }
        // Check user is employer?
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
        if (foundUser.role !== userRole.Employer) {
            return ({
                message: `You aren't a employer, You cannot implement this request`,
                status: 401,
                data: null
            })
        }
        // Creat new post
        const post = await jobpostingRepository.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            contactAddress: req.body.contactAddress,
            workAddress: req.body.workAddress,
            jobTitle: req.body.jobTitle,
            profession: req.body.profession,
            employmentType: req.body.employmentType,
            degree: req.body.degree,
            experience: req.body.experience,
            positionLevel: req.body.positionLevel,
            minAge: req.body.minAge ? req.body.minAge : null,
            maxAge: req.body.maxAge ? req.body.maxAge : null,
            sex: req.body.sex ? req.body.sex : null,
            numberofVacancies: req.body.numberofVacancies,
            trialPeriod: req.body.trialPeriod ? req.body.trialPeriod : null,
            applicationDeadline: new Date(moment(req.body.applicationDeadline, "DD-MM-YYYY").format("MM-DD-YYYY")),
            minSalary: req.body.minSalary,
            maxSalary: req.body.maxSalary,
            skills: req.body.skills ? req.body.skills : null,
            jobDescription: req.body.jobDescription,
            jobRequirements: req.body.jobRequirements,
            benefits: req.body.benefits
        })
        const post1 = await jobpostingRepository.save(post)

        const user = await employerRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['jobpostings']
        })
        if (!user) {
            return ({
                message: 'User not found',
                status: 400,
                data: null
            })
        }

        user.jobpostings.push(post1);
        await employerRepository.save(user);

        return ({
            message: 'Create New jobposting successfully',
            status: 200,
            data: post
        })
    }
}