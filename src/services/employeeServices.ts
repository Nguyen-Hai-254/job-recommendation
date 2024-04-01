import { myDataSource } from "../config/connectDB"
import { Employee } from "../entity/Employee"
import { Employer } from "../entity/Employer"
import { User } from "../entity/Users"
import { userRole } from "../utils/enum"
import { JobPosting } from "../entity/JobPosting"
import { Application } from "../entity/Application"
import { AttachedDocument } from "../entity/AttachedDocument"
import { OnlineProfile } from "../entity/OnlineProfile"
import { EnumDegree, EnumEmploymentType, EnumExperience, EnumPositionLevel } from "../utils/enumAction"
import { Notification } from "../entity/Notification"
import { AnotherDegree } from "../entity/AnotherDegree"
import { EducationInformation } from "../entity/EducationInformation"
import { WorkExperience } from "../entity/WorkExperience"
import moment from "moment"

const userRepository = myDataSource.getRepository(User);
const employerRepository = myDataSource.getRepository(Employer);
const employeeRepository = myDataSource.getRepository(Employee);
const jobpostingRepository = myDataSource.getRepository(JobPosting);
const applicationRepository = myDataSource.getRepository(Application);
const attached_documentRepository = myDataSource.getRepository(AttachedDocument);
const online_profileRepository = myDataSource.getRepository(OnlineProfile);
const notificationRepository = myDataSource.getRepository(Notification);
const another_degreeRepository = myDataSource.getRepository(AnotherDegree);
const education_informationRepository = myDataSource.getRepository(EducationInformation);
const work_experienceRepository = myDataSource.getRepository(WorkExperience);

export default class EmployeeServices {
    static handleGetAttachedDocument = async (req) => {
        const attached_document = await attached_documentRepository.findOne({
            where: { employee: { userId: req.user.userId } },
            relations: ['employee']
        })
        if (!attached_document) {
            return ({
                message: 'No attached document found',
                status: 400,
                data: null
            })
        }

        return ({
            message: 'Find attached document success',
            status: 200,
            data: attached_document
        })
    }

    static handleCreateNewAttachedDocument = async (req) => {
        // Check general information
        console.log(req.body)
        if (!req?.body?.jobTitle || !req?.body?.profession || !req?.body?.currentPosition ||
            !req?.body?.desiredPosition || !req?.body?.desiredSalary || !req?.body?.degree ||
            !req?.body?.workAddress || !req?.body?.experience || !req?.body?.employmentType) {
            return ({
                message: 'general information is required',
                status: 400,
                data: null
            })
        }
        // Check other information
        if (!req?.body?.CV) {
            return ({
                message: 'CV is required',
                status: 400,
                data: null
            })
        }
        // Check attached document exists?
        const exist = await attached_documentRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['employee']
        })
        if (exist) {
            return ({
                message: `Attached document has userId: ${req.user.userId} already exists`,
                status: 400,
                data: null
            })
        }
        // Create new  attached document
        const attached_document = await attached_documentRepository.create({
            userId: req.user.userId,
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
            skills: req.body.skills,
            CV: req.body.CV,
            view: 0,
            isHidden: req?.body?.isHidden ? req.body.isHidden : false
        })
        console.log("check1");
        await attached_documentRepository.save(attached_document);
        console.log("check2");
        // add a notification
        const foundUser = await userRepository.findOne({
            where: { userId: req.user.userId }
        })
        console.log("check3");
        if (!foundUser) {
            return ({
                message: 'User not found',
                status: 400,
                data: null
            })
        }
        console.log("check4");
        const createNotification = notificationRepository.create({
            content: 'Bạn đã tạo hồ sơ đính kèm',
            user: foundUser
        })
        await notificationRepository.save(createNotification);
        console.log("check5");

        return ({
            message: 'Tạo hồ sơ đính kèm thành công',
            status: 200,
            data: attached_document
        })
    }

    static handleUpdateAttachedDocument = async (req) => {
        // Check attached document exists?
        const attached_document = await attached_documentRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['employee']
        })
        if (!attached_document) {
            return ({
                message: `No attached document matches userId: ${req.user.userId}`,
                status: 400,
                data: null
            })
        }

        // Update with req.body
        // general information
        if (req.body?.jobTitle) attached_document.jobTitle = req.body.jobTitle
        if (req.body?.profession) attached_document.profession = req.body.profession
        if (req.body?.currentPosition) attached_document.currentPosition = EnumPositionLevel(req.body.currentPosition)
        if (req.body?.desiredPosition) attached_document.desiredPosition = EnumPositionLevel(req.body.desiredPosition)
        if (req.body?.desiredSalary) attached_document.desiredSalary = req.body.desiredSalary
        if (req.body?.degree) attached_document.degree = EnumDegree(req.body.degree)
        if (req.body?.workAddress) attached_document.workAddress = req.body.workAddress
        if (req.body?.experience) attached_document.experience = EnumExperience(req.body.experience);
        if (req.body?.employmentType) attached_document.employmentType = EnumEmploymentType(req.body.employmentType);
        if (req.body?.careerGoal) attached_document.careerGoal = req.body.careerGoal
        if (req.body?.skills) attached_document.skills = req.body.skills
        // other information
        if (req.body?.CV) attached_document.CV = req.body.CV
        if (req.body?.isHidden !== null) attached_document.isHidden = req.body.isHidden

        await attached_documentRepository.save(attached_document);
        // add a new notification
        const findUser = await userRepository.findOne({
            where: { userId: req.user.userId }
        })
        if (!findUser) {
            return ({
                message: `Không tìm thấy người dùng`,
                status: 400,
                data: null
            })
        }
        const createNotification = notificationRepository.create({
            content: 'Bạn đã cập nhật hồ sơ đính kèm',
            user: findUser
        })
        await notificationRepository.save(createNotification);

        return ({
            message: `attached document has userId: ${req.user.userId} are updated successfully`,
            status: 200,
            data: attached_document
        })

    }

    static handleGetOnlineProfile = async (req) => {
        const online_profile = await online_profileRepository.findOne({
            where: { employee: { userId: req.user.userId } },
            relations: ['employee', 'another_degrees', 'education_informations', 'work_experiences']
        })
        if (!online_profile) {
            return ({
                message: 'No online profile found',
                status: 400,
                data: null
            })
        }

        return ({
            message: 'Find online profile success',
            status: 200,
            data: online_profile
        })
    }

    static handleCreateNewOnlineProfile = async (req) => {
        // Check general information
        if (!req?.body?.jobTitle || !req?.body?.profession || !req?.body?.currentPosition ||
            !req?.body?.desiredPosition || !req?.body?.desiredSalary || !req?.body?.degree ||
            !req?.body?.workAddress || !req?.body?.experience || !req?.body?.employmentType) {
            return ({
                message: 'general information is required',
                status: 400,
                data: null
            })
        }
        // Check other information
        // Check online profile exists?
        const exist = await online_profileRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['employee']
        })
        if (exist) {
            return ({
                message: `Online profile has userId: ${req.user.userId} already exists`,
                status: 400,
                data: null
            })
        }
        // Create new online profile
        const online_profile = await online_profileRepository.create({
            userId: req.user.userId,
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
            skills: req.body.skills,
            view: 0,
            isHidden: req?.body?.isHidden ? req.body.isHidden : false
        })

        await online_profileRepository.save(online_profile);
        // add a notification
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
        const createNotification = notificationRepository.create({
            content: 'Bạn đã tạo hồ sơ trực tuyến',
            user: foundUser
        })
        await notificationRepository.save(createNotification);

        return ({
            message: 'Tạo hồ sơ trực tuyến thành công',
            status: 200,
            data: online_profile
        })
    }

    static handleUpdateOnlineProfile = async (req) => {
        // Check online profile exists?
        const online_profile = await online_profileRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['employee']
        })
        if (!online_profile) {
            return ({
                message: `No online profile matches userId: ${req.user.userId}`,
                status: 400,
                data: null
            })
        }

        // Update with req.body
        // general information
        if (req.body?.jobTitle) online_profile.jobTitle = req.body.jobTitle
        if (req.body?.profession) online_profile.profession = req.body.profession
        if (req.body?.currentPosition) online_profile.currentPosition = EnumPositionLevel(req.body.currentPosition)
        if (req.body?.desiredPosition) online_profile.desiredPosition = EnumPositionLevel(req.body.desiredPosition)
        if (req.body?.desiredSalary) online_profile.desiredSalary = req.body.desiredSalary
        if (req.body?.degree) online_profile.degree = EnumDegree(req.body.degree)
        if (req.body?.workAddress) online_profile.workAddress = req.body.workAddress
        if (req.body?.experience) online_profile.experience = EnumExperience(req.body.experience);
        if (req.body?.employmentType) online_profile.employmentType = EnumEmploymentType(req.body.employmentType);
        if (req.body?.careerGoal) online_profile.careerGoal = req.body.careerGoal
        if (req.body?.skills) online_profile.skills = req.body.skills
        // other information
        if (req.body?.isHidden !== null) online_profile.isHidden = req.body.isHidden
        else online_profile.isHidden = false
        await online_profileRepository.save(online_profile);
        // add a new notification
        const findUser = await userRepository.findOneBy({
            userId: req.user.userId
        })
        if (!findUser) {
            return ({
                message: `Không tìm thấy người dùng`,
                status: 400,
                data: null
            })
        }
        const createNotification = notificationRepository.create({
            content: 'Bạn đã cập nhật hồ sơ trực tuyến',
            user: findUser
        })
        await notificationRepository.save(createNotification);



        return ({
            message: `online profile has userId: ${req.user.userId} are updated successfully`,
            status: 200,
            data: online_profile
        })

    }

    // Update online profile: another degree, education information, work experience
    // 1. another degree
    static handleCreateNewAnotherDegree = async (req) => {
        // Check parameters
        if (!req?.body?.degreeName || !req?.body?.level) {
            return ({
                message: 'degreeName and level are required',
                status: 400,
                data: null
            })
        }
        // Check online profile exists?
        const online_profile = await online_profileRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['employee', 'another_degrees']
        })
        if (!online_profile) {
            return ({
                message: `Online profile has userId: ${req.user.userId} doesn't exist`,
                status: 400,
                data: null
            })
        }
        const another_degree = await another_degreeRepository.create({
            degreeName: req.body.degreeName,
            level: req.body.level
        })
        const another_degree1 = await another_degreeRepository.save(another_degree)
        online_profile.another_degrees.push(another_degree1);
        await online_profileRepository.save(online_profile);

        return ({
            message: 'Create New Another Degree successfully',
            status: 200,
            data: online_profile.another_degrees
        })

    }

    static handleUpdateAnotherDegree = async (req) => {
        // Check parameters
        if (!req?.params.id) {
            return ({
                message: 'id of another degree  is required',
                status: 400,
                data: null
            })
        }
        // Check another degree exists?
        const another_degree = await another_degreeRepository.findOne({
            where: { id: req.params.id },
            relations: ['online_profile']
        })
        if (!another_degree) {
            return ({
                message: `another degree has id: ${req.params.id} not found`,
                status: 400,
                data: null
            })
        }
        // Check employee is owner of another degree ?
        if (another_degree.online_profile.userId !== req.user.userId) {
            return ({
                message: `You are not the owner of another degree has id: ${req.params.id}`,
                status: 403,
                data: null
            })
        }

        if (req.body?.degreeName) another_degree.degreeName = req.body.degreeName
        if (req.body?.level) another_degree.level = req.body.level
        await another_degreeRepository.save(another_degree)

        return ({
            message: `Update Another Degree has id: ${req.params.id}  successfully`,
            status: 200,
            data: {
                userId: another_degree.online_profile.userId,
                id: another_degree.id,
                degreeName: another_degree.degreeName,
                level: another_degree.level
            }
        })

    }

    static handleDeleteAnotherDegree = async (req) => {
        // Check parameters
        if (!req?.params.id) {
            return ({
                message: 'id of another degree  is required',
                status: 400,
                data: null
            })
        }
        // Check another degree exists?
        const another_degree = await another_degreeRepository.findOne({
            where: { id: req.params.id },
            relations: ['online_profile']
        })
        if (!another_degree) {
            return ({
                message: `another degree has id: ${req.params.id} not found`,
                status: 400,
                data: null
            })
        }
        // Check employee is owner of another degree ?
        if (another_degree.online_profile.userId !== req.user.userId) {
            return ({
                message: `You are not the owner of another degree has id: ${req.params.id}`,
                status: 403,
                data: null
            })
        }

        await another_degreeRepository.delete(another_degree.id)

        return ({
            message: `Delete Another Degree has id: ${another_degree.id}  successfully`,
            status: 200,
            data: {
                userId: another_degree.online_profile.userId,
                id: another_degree.id,
                degreeName: another_degree.degreeName,
                level: another_degree.level
            }
        })

    }

    // 2. education information
    static handleCreateNewEducationInformation = async (req) => {
        // Check parameters
        if (!req?.body?.schoolName || !req?.body?.specialization || !req?.body?.degreeName ||
            !req?.body?.startDate || !req?.body?.endDate) {
            return ({
                message: 'schoolName, specialization, degreeName, startDate, endDate are required',
                status: 400,
                data: null
            })
        }
        // Check online profile exists?
        const online_profile = await online_profileRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['employee', 'education_informations']
        })
        if (!online_profile) {
            return ({
                message: `Online profile has userId: ${req.user.userId} doesn't exist`,
                status: 400,
                data: null
            })
        }
        const education_information = await education_informationRepository.create({
            schoolName: req.body.schoolName,
            specialization: req.body.specialization,
            degreeName: req.body.degreeName,
            startDate: new Date(moment(req.body.startDate, "DD-MM-YYYY").format("MM-DD-YYYY")),
            endDate: new Date(moment(req.body.endDate, "DD-MM-YYYY").format("MM-DD-YYYY"))
        })
        const education_information1 = await education_informationRepository.save(education_information)
        online_profile.education_informations.push(education_information1);
        await online_profileRepository.save(online_profile);

        return ({
            message: 'Create New Education Infomation successfully',
            status: 200,
            data: online_profile.education_informations
        })

    }

    static handleUpdateEducationInformation = async (req) => {
        // Check parameters
        if (!req?.params.id) {
            return ({
                message: 'id of education information  is required',
                status: 400,
                data: null
            })
        }
        // Check education information exists?
        const education_information = await education_informationRepository.findOne({
            where: { id: req.params.id },
            relations: ['online_profile']
        })
        if (!education_information) {
            return ({
                message: `education information has id: ${req.params.id} not found`,
                status: 400,
                data: null
            })
        }
        // Check employee is owner of education information ?
        if (education_information.online_profile.userId !== req.user.userId) {
            return ({
                message: `You are not the owner of education information has id: ${req.params.id}`,
                status: 403,
                data: null
            })
        }

        if (req.body?.schoolName) education_information.schoolName = req.body.schoolName
        if (req.body?.specialization) education_information.specialization = req.body.specialization
        if (req.body?.degreeName) education_information.degreeName = req.body.degreeName
        if (req.body?.startDate) education_information.startDate = new Date(moment(req.body.startDate, "DD-MM-YYYY").format("MM-DD-YYYY"))
        if (req.body?.endDate) education_information.endDate = new Date(moment(req.body.endDate, "DD-MM-YYYY").format("MM-DD-YYYY"))
        await education_informationRepository.save(education_information)

        return ({
            message: `Update Education information has id: ${req.params.id}  successfully`,
            status: 200,
            data: education_information
        })

    }

    static handleDeleteEducationInformation = async (req) => {
        // Check parameters
        if (!req?.params.id) {
            return ({
                message: 'id of education information  is required',
                status: 400,
                data: null
            })
        }
        // Check education information exists?
        const education_information = await education_informationRepository.findOne({
            where: { id: req.params.id },
            relations: ['online_profile']
        })
        if (!education_information) {
            return ({
                message: `education information has id: ${req.params.id} not found`,
                status: 400,
                data: null
            })
        }
        // Check employee is owner of another degree ?
        if (education_information.online_profile.userId !== req.user.userId) {
            return ({
                message: `You are not the owner of education information has id: ${req.params.id}`,
                status: 403,
                data: null
            })
        }

        await education_informationRepository.delete(education_information.id)

        return ({
            message: `Delete Education Information has id: ${education_information.id}  successfully`,
            status: 200,
            data: education_information
        })

    }

    // 3. work experience
    static handleCreateNewWorkExperience = async (req) => {
        // Check parameters
        if (!req?.body?.jobTitle || !req?.body?.companyName || !req?.body?.jobDescription ||
            !req?.body?.startDate || (!req?.body?.endDate && !req?.body?.isDoing)) {
            return ({
                message: 'jobTitle, companyName, jobDescription, startDate, (endDate or isDoing) are required',
                status: 400,
                data: null
            })
        }
        // Check online profile exists?
        const online_profile = await online_profileRepository.findOne({
            where: { userId: req.user.userId },
            relations: ['employee', 'work_experiences']
        })
        if (!online_profile) {
            return ({
                message: `Online profile has userId: ${req.user.userId} doesn't exist`,
                status: 400,
                data: null
            })
        }
        const work_experience = await work_experienceRepository.create({
            jobTitle: req.body.jobTitle,
            companyName: req.body.companyName,
            jobDescription: req.body.jobDescription,
            startDate: new Date(moment(req.body.startDate, "DD-MM-YYYY").format("MM-DD-YYYY"))
        })
        if (req.body?.isDoing) work_experience.isDoing = req.body.isDoing
        if (!work_experience.isDoing) work_experience.endDate = new Date(moment(req.body.endDate, "DD-MM-YYYY").format("MM-DD-YYYY"))

        const work_experience1 = await work_experienceRepository.save(work_experience)
        online_profile.work_experiences.push(work_experience1);
        await online_profileRepository.save(online_profile);

        return ({
            message: 'Create New Another Degree successfully',
            status: 200,
            data: online_profile.work_experiences
        })

    }

    static handleUpdateWorkExperience = async (req) => {
        // Check parameters
        if (!req?.params.id) {
            return ({
                message: 'id of work experience  is required',
                status: 400,
                data: null
            })
        }
        // Check work experience exists?
        const work_experience = await work_experienceRepository.findOne({
            where: { id: req.params.id },
            relations: ['online_profile']
        })
        if (!work_experience) {
            return ({
                message: `Work experience has id: ${req.params.id} not found`,
                status: 400,
                data: null
            })
        }
        // Check employee is owner of work experience ?
        if (work_experience.online_profile.userId !== req.user.userId) {
            return ({
                message: `You are not the owner of work experience has id: ${req.params.id}`,
                status: 403,
                data: null
            })
        }

        if (req.body?.jobTitle) work_experience.jobTitle = req.body.jobTitle
        if (req.body?.companyName) work_experience.companyName = req.body.companyName
        if (req.body?.jobDescription) work_experience.jobDescription = req.body.jobDescription
        if (req.body?.startDate) work_experience.startDate = new Date(moment(req.body.startDate, "DD-MM-YYYY").format("MM-DD-YYYY"))
        // handle isDoing and endDate
        if (req.body?.isDoing && req.body?.endDate) {
            return ({
                message: `cannot update when body has: isDoing is true and endDate exist`,
                status: 400,
                data: null
            })
        }
        if (req.body?.isDoing && !req.body?.endDate) {
            work_experience.endDate = new Date(moment(null, "DD-MM-YYYY").format("MM-DD-YYYY"));
            work_experience.isDoing = true;
        }
        if (req.body?.isDoing !== null && req.body?.isDoing !== undefined && req.body?.isDoing === false && !req.body?.endDate) {
            return ({
                message: `cannot update when body has: isDoing is false and endDate not exist`,
                status: 400,
                data: null
            })
        }
        if (!req.body?.isDoing && req.body?.endDate) {
            work_experience.endDate = new Date(moment(req.body.endDate, "DD-MM-YYYY").format("MM-DD-YYYY"));
            work_experience.isDoing = false;
        }

        await work_experienceRepository.save(work_experience)

        return ({
            message: `Update Work Experience has id: ${req.params.id}  successfully`,
            status: 200,
            data: work_experience
        })

    }

    static handleDeleteWorkExperience = async (req) => {
        // Check parameters
        if (!req?.params.id) {
            return ({
                message: 'id of education information  is required',
                status: 400,
                data: null
            })
        }
        // Check education information exists?
        const work_experience = await work_experienceRepository.findOne({
            where: { id: req.params.id },
            relations: ['online_profile']
        })
        if (!work_experience) {
            return ({
                message: `work experience has id: ${req.params.id} not found`,
                status: 400,
                data: null
            })
        }
        // Check employee is owner of work experience ?
        if (work_experience.online_profile.userId !== req.user.userId) {
            return ({
                message: `You are not the owner of work experience has id: ${req.params.id}`,
                status: 403,
                data: null
            })
        }

        await work_experienceRepository.delete(work_experience.id)

        return ({
            message: `Delete work experience has id: ${work_experience.id}  successfully`,
            status: 200,
            data: work_experience
        })

    }

}

