import { myDataSource } from "../config/connectDB"
import { Employee } from "../entity/Employee"
import { Employer } from "../entity/Employer"
import { User } from "../entity/Users"
import { applicationType, userRole } from "../utils/enum"
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
import { Brackets, EntityManager } from "typeorm"

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
        
        await attached_documentRepository.save(attached_document);
        
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
            content: 'Bạn đã tạo hồ sơ đính kèm',
            user: foundUser
        })
        await notificationRepository.save(createNotification);

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
        // update keywords
        if (req.body?.keywords) attached_document.keywords = req.body.keywords

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
        // update keywords
        if (req.body?.keywords) online_profile.keywords = req.body.keywords

        
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

    // Features for employer, admin
    static handleGetEmployeesByAdmin = async (req) => {
        const { name, profession, num, page } = req.query;

        let query = employeeRepository
            .createQueryBuilder('employee')
            .select(['employee','online_profile','work_experiences','education_informations','another_degrees','attached_document','user.name','user.email','user.dob','user.address','user.phone','user.sex','user.avatar','user.role','user.createAt'])
            .leftJoin('employee.online_profile', 'online_profile')
            .leftJoin('online_profile.work_experiences', 'work_experiences')
            .leftJoin('online_profile.education_informations','education_informations')
            .leftJoin('online_profile.another_degrees','another_degrees')
            .leftJoin('employee.attached_document', 'attached_document')
            .leftJoin('employee.user','user');

        if (profession) {
            query = query.andWhere(
                new Brackets(qb =>
                    qb.where('online_profile.profession LIKE :profession', {profession: `%${profession}%`})
                      .orWhere('attached_document.profession LIKE :profession', {profession: `%${profession}%`})
                )
            );
        }
        if (name) {
            query = query.andWhere('user.name LIKE :name', {name: `%${name}%`});
        }

        // Pagination
        if (num && page) {
            const skip = (parseInt(page) - 1) * parseInt(num);
            const take = parseInt(num);

            query = query.skip(skip).take(take);
        }
        
        const employees = await query.getMany();

        return ({
            message: 'Get Employees By Admin sucesss',
            status: 200,
            data: employees
        })
    }

    static handleGetLengthOfEmployeesByAdmin = async (req) => {
        const { name, profession } = req.query;

        let query = employeeRepository
            .createQueryBuilder('employee')
            .select(['employee','online_profile','work_experiences','education_informations','another_degrees','attached_document','user.name','user.email','user.dob','user.address','user.phone','user.sex','user.avatar','user.role','user.createAt'])
            .leftJoin('employee.online_profile', 'online_profile')
            .leftJoin('online_profile.work_experiences', 'work_experiences')
            .leftJoin('online_profile.education_informations','education_informations')
            .leftJoin('online_profile.another_degrees','another_degrees')
            .leftJoin('employee.attached_document', 'attached_document')
            .leftJoin('employee.user','user');

        if (profession) {
            query = query.andWhere(
                new Brackets(qb =>
                    qb.where('online_profile.profession LIKE :profession', {profession: `%${profession}%`})
                      .orWhere('attached_document.profession LIKE :profession', {profession: `%${profession}%`})
                )
            );
        }

        if (name) {
            query = query.andWhere('user.name LIKE :name', {name: `%${name}%`});
        }
        
        
        const totalResults = await query.getCount();

        return ({
            message: 'Get Employees By Admin sucesss',
            status: 200,
            data: {totalResults: totalResults}
        })
    }

    static handleGetEmployeesByEmployer = async (req) => {
        const {jobTitle, profession, minSalary, maxSalary, degree, workAddress, experience, employmentType, sex, num, page} = req.query;

        let queryforOnlineProfile = online_profileRepository
            .createQueryBuilder('online_profile')
            .select(['online_profile','work_experiences','education_informations','another_degrees', 'employee.isMarried', 'user.userId','user.name','user.dob','user.address','user.sex','user.avatar'])
            .where('online_profile.isHidden = false')
            .leftJoin('online_profile.work_experiences', 'work_experiences')
            .leftJoin('online_profile.education_informations','education_informations')
            .leftJoin('online_profile.another_degrees','another_degrees')
            .leftJoin('online_profile.employee', 'employee')
            .leftJoin('employee.user','user')

        let queryforAttachedDocument = attached_documentRepository
            .createQueryBuilder('attached_document')
            .select(['attached_document','employee.isMarried', 'user.userId','user.name','user.dob','user.address','user.sex','user.avatar', 'user.phone', 'user.email'])
            .where('attached_document.isHidden = false')
            .leftJoin('attached_document.employee','employee')
            .leftJoin('employee.user','user')

        // Public
        if (workAddress) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
        }
        if (jobTitle) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
        }
        if (profession) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.profession LIKE :profession', { profession: `%${profession}%` });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.profession LIKE :profession', { profession: `%${profession}%` });
        }
        if (employmentType) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.employmentType = :employmentType', { employmentType });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.employmentType = :employmentType', { employmentType });
        }
        if (degree) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.degree = :degree', { degree });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.degree = :degree', { degree });
        }
        if (experience) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.experience = :experience', { experience });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.experience = :experience', { experience });
        }
        if (sex) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('user.sex = :sex', { sex });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('user.sex = :sex', { sex });
        }
        if (minSalary) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.desiredSalary >= :minSalary', { minSalary });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.desiredSalary >= :minSalary', { minSalary });
        }
        if (maxSalary) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.desiredSalary <= :maxSalary', { maxSalary });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.desiredSalary <= :maxSalary', { maxSalary });
        }

        const lengthOfOnline_profiles = await queryforOnlineProfile.getCount();

        let numOfAttached_documents = 0;

        // Pagination
        if (num && page) {
            // Pagination for Online Profile
            const skip = (parseInt(page) - 1) * parseInt(num);
            const take = parseInt(num);

            queryforOnlineProfile = queryforOnlineProfile.skip(skip).take(take);

            // Pagination for Attached Document
            const numOfOnlineProfile = lengthOfOnline_profiles > skip ? lengthOfOnline_profiles - skip : 0;
            numOfAttached_documents = take > numOfOnlineProfile ? take - numOfOnlineProfile : 0;
            let skip1 = skip > lengthOfOnline_profiles ? skip - lengthOfOnline_profiles : 0;
            queryforAttachedDocument = queryforAttachedDocument.skip(skip1).take(numOfAttached_documents);
        }

        const online_profiles = await queryforOnlineProfile.getMany();
        const attached_documents = numOfAttached_documents ? await queryforAttachedDocument.getMany(): [];

        return ({
            message: 'Get Employees By Employer sucesss',
            status: 200,
            data: [...online_profiles, ...attached_documents]
        })
    }

    static handleGetLengthOfEmployeesByEmployer = async (req) => {
        const {jobTitle, profession, minSalary, maxSalary, degree, workAddress, experience, employmentType, sex} = req.query;

        let queryforOnlineProfile = online_profileRepository
            .createQueryBuilder('online_profile')
            .select(['online_profile','work_experiences','education_informations','another_degrees', 'employee.isMarried', 'user.userId','user.name','user.dob','user.address','user.sex','user.avatar'])
            .where('online_profile.isHidden = false')
            .leftJoin('online_profile.work_experiences', 'work_experiences')
            .leftJoin('online_profile.education_informations','education_informations')
            .leftJoin('online_profile.another_degrees','another_degrees')
            .leftJoin('online_profile.employee', 'employee')
            .leftJoin('employee.user','user')

        let queryforAttachedDocument = attached_documentRepository
            .createQueryBuilder('attached_document')
            .select(['attached_document','employee.isMarried', 'user.userId','user.name','user.dob','user.address','user.sex','user.avatar'])
            .where('attached_document.isHidden = false')
            .leftJoin('attached_document.employee','employee')
            .leftJoin('employee.user','user')

        // Public
        if (workAddress) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
        }
        if (jobTitle) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
        }
        if (profession) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.profession LIKE :profession', { profession: `%${profession}%` });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.profession LIKE :profession', { profession: `%${profession}%` });
        }
        if (employmentType) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.employmentType = :employmentType', { employmentType });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.employmentType = :employmentType', { employmentType });
        }
        if (degree) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.degree = :degree', { degree });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.degree = :degree', { degree });
        }
        if (experience) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.experience = :experience', { experience });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.experience = :experience', { experience });
        }
        if (sex) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('user.sex = :sex', { sex });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('user.sex = :sex', { sex });
        }
        if (minSalary) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.desiredSalary >= :minSalary', { minSalary });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.desiredSalary >= :minSalary', { minSalary });
        }
        if (maxSalary) {
            queryforOnlineProfile = queryforOnlineProfile.andWhere('online_profile.desiredSalary <= :maxSalary', { maxSalary });
            queryforAttachedDocument = queryforAttachedDocument.andWhere('attached_document.desiredSalary <= :maxSalary', { maxSalary });
        }

        const lengthOfOnline_profiles = await queryforOnlineProfile.getCount();
        const lengthOfAttached_profiles = await queryforAttachedDocument.getCount();

        return ({
            message: 'Get Length of Employees By Employer sucesss',
            status: 200,
            data: {lengthOfOnline_profiles, lengthOfAttached_profiles}
        })
    }

    static handleGetEmployeesByEmployerSortByKeywords = async (req) => {
        const { keywords, num, page } = req.query;

        if (!keywords || !num || !page) {
            return ({
                message: 'keywords, num, page are not null',
                status: 400,
                data: null
            })
        }
        const sortByKeywords = await sortOnlineProfilesAndAttachedDocumentsByKeyWords(keywords, +num, +page);

        let queryforOnlineProfile = online_profileRepository
            .createQueryBuilder('online_profile')
            .select(['online_profile','work_experiences','education_informations','another_degrees', 'employee.isMarried', 'user.userId','user.name','user.dob','user.address','user.sex','user.avatar'])
            .where('online_profile.isHidden = false')
            .leftJoin('online_profile.work_experiences', 'work_experiences')
            .leftJoin('online_profile.education_informations','education_informations')
            .leftJoin('online_profile.another_degrees','another_degrees')
            .leftJoin('online_profile.employee', 'employee')
            .leftJoin('employee.user','user')

        let queryforAttachedDocument = attached_documentRepository
            .createQueryBuilder('attached_document')
            .select(['attached_document','employee.isMarried', 'user.userId','user.name','user.dob','user.address','user.sex','user.avatar'])
            .where('attached_document.isHidden = false')
            .leftJoin('attached_document.employee','employee')
            .leftJoin('employee.user','user')
    
        const results: any = [];
        const lengthOfSortByKeywords = sortByKeywords.result.length;
        for (let i = 0; i <lengthOfSortByKeywords; i++) {
            if (sortByKeywords.result[i].type == '0') {
                let tmp = await queryforOnlineProfile.andWhere('online_profile.userId = :userId', {userId: sortByKeywords.result[i].userId}).getOne();
                results.push(tmp);
            } else if (sortByKeywords.result[i].type == '1') {
                let tmp = await queryforAttachedDocument.andWhere('attached_document.userId = :userId', {userId: sortByKeywords.result[i].userId}).getOne();
                results.push(tmp);
            }

        }
            
        return ({
            message: 'Get Employees By Employer sort by keywords sucesss',
            status: 200,
            data:  {
                totalCount: sortByKeywords.totalCount,
                result: results
            }
        })
    }

}

async function sortOnlineProfilesAndAttachedDocumentsByKeyWords (keywords: string, num: number, page: number) {
    const entityManager = myDataSource.manager as EntityManager;

    const keywordArray = keywords.split(',');
      
    const onlineProfileQuery = `
        SELECT 
            online_profile.userId AS userId, 
            0 AS type,
            (${keywordArray.map((keyword) => `CASE WHEN online_profile.keywords LIKE '%${keyword}%' THEN 1 ELSE 0 END`).join(' + ')}) AS count
        FROM online_profile
        WHERE online_profile.isHidden = false
        HAVING count > 0
    `;

    const attachedDocumentQuery = `
        SELECT 
            attached_document.userId AS userId, 
            1 AS type,
            (${keywordArray.map((keyword) => `CASE WHEN attached_document.keywords LIKE '%${keyword}%' THEN 1 ELSE 0 END`).join(' + ')}) AS count
        FROM attached_document
        WHERE attached_document.isHidden = false
        HAVING count > 0
    `;

    // TODO: Total Count
    const onlineProfileCountQuery = `
        SELECT COUNT(*) AS totalCount
        FROM (${onlineProfileQuery}) AS onlineProfiles
    `;

    const attachedDocumentCountQuery = `
        SELECT COUNT(*) AS totalCount
        FROM (${attachedDocumentQuery}) AS attachedDocuments
    `;

    const onlineProfileCountResult = await entityManager.query(onlineProfileCountQuery);
    const attachedDocumentCountResult = await entityManager.query(attachedDocumentCountQuery);
    // TODO: Query
    const result = await entityManager.query(
        `
        (${onlineProfileQuery} UNION ${attachedDocumentQuery}) 
        ORDER BY count DESC 
        LIMIT ${num}
        OFFSET ${(page-1)*num} 
        `
    );

    const totalCount = Number(onlineProfileCountResult[0].totalCount) + Number(attachedDocumentCountResult[0].totalCount);

    return {
        totalCount: totalCount,
        result: result
    };
}

