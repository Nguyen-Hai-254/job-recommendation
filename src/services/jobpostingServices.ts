import { myDataSource } from "../config/connectDB"
import { MySQLErrorCode, approvalStatus } from "../utils/enum"
import { JobPosting } from "../entity/JobPosting"
import moment from "moment"
import { EnumEmploymentType, EnumDegree, EnumExperience, EnumPositionLevel, EnumSex, EnumApprovalStatus } from "../utils/enumAction"
import { Brackets } from "typeorm"
import { HttpException } from "../exceptions/httpException"
import NotificationServices from "./notificationServices"

const jobPostingRepository = myDataSource.getRepository(JobPosting);

export default class JobPostingServices {
    static handleGetJobPosting = async (postId) => {               
        const jobPosting = await jobPostingRepository.findOne({
            where: { postId: postId, isHidden: false },
            relations: ['employer']
        })
        if (!jobPosting) throw new HttpException(404, `No Job posting matches postId: ${postId}`)
           
        jobPosting.view += 1
        await jobPosting.save()

        return jobPosting
    }

    static handleGetAllJobPostings = async (reqQuery) => {
        const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, employerId, keywords, num, page } = reqQuery;
        let query = jobPostingRepository.createQueryBuilder('job-postings');
        // jobposting for employee, employer, unknown
        query = query.leftJoinAndSelect("job-postings.employer", "employer")
            .where('job-postings.status = :status', { status: approvalStatus.approved })
        // Public
        if (workAddress) {
            query = query.andWhere('job-postings.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
        }
        if (jobTitle) {
            query = query.andWhere('job-postings.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
        }
        if (profession) {
            const professionArray = profession.split(',');
            query = query.andWhere(`(${professionArray.map((keyword) =>  `job-postings.profession LIKE '%${keyword}%'`).join(' OR ')})`);
        }
        if (employmentType) {
            query = query.andWhere('job-postings.employmentType = :employmentType', { employmentType });
        }
        if (degree) {
            query = query.andWhere('job-postings.degree = :degree', { degree });
        }
        if (experience) {
            query = query.andWhere('job-postings.experience = :experience', { experience });
        }
        if (positionLevel) {
            query = query.andWhere('job-postings.positionLevel = :positionLevel', { positionLevel });
        }
        if (sex) {
            query = query.andWhere(
                new Brackets(qb =>
                    qb.where('job-postings.sex = :sex', { sex })
                        .orWhere('job-postings.sex IS NULL')
                )
            );
        }
        if (salary) {
            query = query.andWhere(':salary BETWEEN job-postings.minSalary AND job-postings.maxSalary', { salary });
        }
        // query by employerId
        if (employerId) {
            query = query.andWhere('job-postings.employer.userId = :employerId', { employerId });
        }
        // query by keywords
        if (keywords) {
            const keywordArray = keywords.split(',');

            const conditions = keywordArray.map((keyword, index) => {
                query.setParameter(`keyword${index}`, `%${keyword}%`);
                return `job-postings.keywords LIKE :keyword${index}`;
            });
            query.andWhere(`(${conditions.join(' OR ')})`);

            const orderByConditions = keywordArray.map((keyword, index) => {
                query.setParameter(`keyword${index}`, `%${keyword}%`);
                return `IF(job-postings.keywords LIKE :keyword${index}, 1, 0)`;
            });
            query.orderBy(`(${orderByConditions.join(' + ')})`, 'DESC');
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

        query = query.orderBy('job-postings.updateAt', 'DESC')

        const jobPostings = await query.getMany();

        return jobPostings ? jobPostings : [];
    }

    static handleGetLengthOfAllJobPostings = async (reqQuery) => {
        const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, employerId, keywords } = reqQuery;
        let query = jobPostingRepository.createQueryBuilder('job-postings');
        // jobposting for employee, employer, unknown
        query = query.leftJoinAndSelect("job-postings.employer", "employer")
            .where('job-postings.status = :status', { status: approvalStatus.approved })

        // Public
        if (workAddress) {
            query = query.andWhere('job-postings.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
        }
        if (jobTitle) {
            query = query.andWhere('job-postings.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
        }
        if (profession) {
            const professionArray = profession.split(',');
            query = query.andWhere(`(${professionArray.map((keyword) =>  `job-postings.profession LIKE '%${keyword}%'`).join(' OR ')})`);
        }
        if (employmentType) {
            query = query.andWhere('job-postings.employmentType = :employmentType', { employmentType });
        }
        if (degree) {
            query = query.andWhere('job-postings.degree = :degree', { degree });
        }
        if (experience) {
            query = query.andWhere('job-postings.experience = :experience', { experience });
        }
        if (positionLevel) {
            query = query.andWhere('job-postings.positionLevel = :positionLevel', { positionLevel });
        }
        if (sex) {
            query = query.andWhere(
                new Brackets(qb =>
                    qb.where('job-postings.sex = :sex', { sex })
                        .orWhere('job-postings.sex IS NULL')
                )
            );
        }
        if (salary) {
            query = query.andWhere(':salary BETWEEN job-postings.minSalary AND job-postings.maxSalary', { salary });
        }
        // query by employerId
        if (employerId) {
            query = query.andWhere('job-postings.employer.userId = :employerId', { employerId });
        }
        // query by keywords
        if (keywords) {
            const keywordArray = keywords.split(',');

            const conditions = keywordArray.map((keyword, index) => {
                query.setParameter(`keyword${index}`, `%${keyword}%`);
                return `job-postings.keywords LIKE :keyword${index}`;
            });
            query.andWhere(`(${conditions.join(' OR ')})`);

            const orderByConditions = keywordArray.map((keyword, index) => {
                query.setParameter(`keyword${index}`, `%${keyword}%`);
                return `IF(job-postings.keywords LIKE :keyword${index}, 1, 0)`;
            });
            query.orderBy(`(${orderByConditions.join(' + ')})`, 'DESC');
        }

        const totalResults = await query.getCount();

        return { totalResults: totalResults };
    }

    static handleGetAllJobPostingsByAdmin = async (reqQuery) => {
        const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, status, num, page } = reqQuery;
        let query = jobPostingRepository.createQueryBuilder('job-postings');
        // all jobposting for admin
        query = query.leftJoinAndSelect("job-postings.employer", "employer");
        query = query.leftJoinAndSelect("job-postings.applications", "applications");
        if (status) {
            query = query.where('job-postings.status = :status', { status });
        }
        // Public
        if (workAddress) {
            query = query.andWhere('job-postings.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
        }
        if (jobTitle) {
            query = query.andWhere('job-postings.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
        }
        if (profession) {
            const professionArray = profession.split(',');
            query = query.andWhere(`(${professionArray.map((keyword) =>  `job-postings.profession LIKE '%${keyword}%'`).join(' OR ')})`);
        }
        if (employmentType) {
            query = query.andWhere('job-postings.employmentType = :employmentType', { employmentType });
        }
        if (degree) {
            query = query.andWhere('job-postings.degree = :degree', { degree });
        }
        if (experience) {
            query = query.andWhere('job-postings.experience = :experience', { experience });
        }
        if (positionLevel) {
            query = query.andWhere('job-postings.positionLevel = :positionLevel', { positionLevel });
        }
        if (sex) {
            query = query.andWhere(
                new Brackets(qb =>
                    qb.where('job-postings.sex = :sex', { sex })
                        .orWhere('job-postings.sex IS NULL')
                )
            );
        }
        if (salary) {
            query = query.andWhere(':salary BETWEEN job-postings.minSalary AND job-postings.maxSalary', { salary });
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

        query = query.orderBy('job-postings.updateAt', 'DESC')

        const jobPostings = await query.getMany();

        const data = jobPostings.map(job => ({
                ...job,
                submissionCount: job.applications.length
        }));
        return data ? data : [];
    }

    static handleGetLengthOfAllJobPostingsByAdmin = async (reqQuery) => {
       
        const { workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, sex, salary, status } = reqQuery;
        let query = jobPostingRepository.createQueryBuilder('job-postings');
        // all jobposting for admin
        query = query.leftJoinAndSelect("job-postings.employer", "employer");
        if (status) {
            query = query.where('job-postings.status = :status', { status });
        }
        // Public
        if (workAddress) {
            query = query.andWhere('job-postings.workAddress LIKE :workAddress', { workAddress: `%${workAddress}%` });
        }
        if (jobTitle) {
            query = query.andWhere('job-postings.jobTitle LIKE :jobTitle', { jobTitle: `%${jobTitle}%` });
        }
        if (profession) {
            const professionArray = profession.split(',');
            query = query.andWhere(`(${professionArray.map((keyword) =>  `job-postings.profession LIKE '%${keyword}%'`).join(' OR ')})`);
        }
        if (employmentType) {
            query = query.andWhere('job-postings.employmentType = :employmentType', { employmentType });
        }
        if (degree) {
            query = query.andWhere('job-postings.degree = :degree', { degree });
        }
        if (experience) {
            query = query.andWhere('job-postings.experience = :experience', { experience });
        }
        if (positionLevel) {
            query = query.andWhere('job-postings.positionLevel = :positionLevel', { positionLevel });
        }
        if (sex) {
            query = query.andWhere(
                new Brackets(qb =>
                    qb.where('job-postings.sex = :sex', { sex })
                        .orWhere('job-postings.sex IS NULL')
                )
            );
        }
        if (salary) {
            query = query.andWhere(':salary BETWEEN job-postings.minSalary AND job-postings.maxSalary', { salary });
        }
        const totalResults = await query.getCount();

        return { totalResults: totalResults };
        
    }

    static handleGetTotalResultsOfProfession = async (reqQuery) => {
        const { status } = reqQuery;

        let query = jobPostingRepository.createQueryBuilder('jobPosting')
            .select('jobPosting.profession', 'profession');
        if (status)  query = query.where('jobPosting.status = :status', { status });
        const posts = await query.getRawMany();

        const professionCount = {};

        for (const post of posts) {
            const professions = post.profession.split(',');
          
            for (const profession of professions) {
              if (professionCount[profession.trim()]) {
                professionCount[profession.trim()] += 1;
              } else {
                professionCount[profession.trim()] = 1;
              }
            }
        }

        const result = Object.keys(professionCount).map(key => ({
            'profession_value': key,
            'count': professionCount[key]
          }));
        
        return result;
    }


    static handleGetJobPostingsByEmployer = async (employerId, reqQuery) => {
        const { status, num, page } = reqQuery;
        let query = jobPostingRepository
            .createQueryBuilder('jobPosting')
            .leftJoin('jobPosting.employer', 'employer')
            .leftJoinAndSelect("jobPosting.applications", "applications")
            .where('employer.userId = :userId', { userId: employerId })

        if (status) {
            query = query.andWhere('jobPosting.status = :status', { status });
        }

        const totalResults = await query.getCount();

        // Pagination
        if (num && page) {
            const skip = (parseInt(page) - 1) * parseInt(num);
            const take = parseInt(num);

            query = query.skip(skip).take(take);
        }
        else {
            query = query.skip(0).take(10);
        }

        query = query.orderBy('jobPosting.updateAt', 'DESC')

        const jobPostings = await query.getMany();

        const data = {
                totalResults: totalResults,
                result: jobPostings.map(job => ({
                    ...job,
                    submissionCount: job.applications.length
                }))
            }

        return data ? data : [];
    }

    static handleGetJobPostingByEmployer = async (employerId, postId) => { 
        const jobPosting = await jobPostingRepository.findOne({
            where: { postId: postId },
            relations: ['employer', 'applications'],
        })
        if (!jobPosting) throw new HttpException(404, `No Job posting matches postId: ${postId}`)
        if (jobPosting.employer.userId !== employerId) {
            throw new HttpException(403, `You aren't a owner of jobPosting with postId: ${postId}`)
        }
        return jobPosting;
    }

    static handleUpdateJobPosting = async (employerId, postId, dto) => {
        const { 
            name, email, phone, contactAddress, 
            workAddress, jobTitle, profession, employmentType, degree, experience, positionLevel, minAge, maxAge, sex,
            numberOfVacancies, trialPeriod, applicationDeadline, minSalary, maxSalary, skills,
            jobDescription, jobRequirements, benefits, requiredSkills, keywords,
            isHidden
         } = dto;

        const jobPosting = await jobPostingRepository.findOne({
            where: { postId: postId },
            relations: ['employer.user']
        })
        if (!jobPosting) throw new HttpException(404, `No Job posting matches postId: ${postId}`)

        if (jobPosting.employer.userId !== employerId) {
            throw new HttpException(403, `You aren't a owner of jobPosting with postId: ${postId}`)
        }

        // Update with req.body
        if (name) jobPosting.name = name
        if (email) jobPosting.email = email
        if (phone) jobPosting.phone = phone
        if (contactAddress) jobPosting.contactAddress = contactAddress
        if (workAddress) jobPosting.workAddress = workAddress

        if (jobTitle) jobPosting.jobTitle = jobTitle
        if (profession) jobPosting.profession = profession
        if (employmentType) jobPosting.employmentType = EnumEmploymentType(employmentType)
        if (degree) jobPosting.degree = EnumDegree(degree)
        if (experience) jobPosting.experience = EnumExperience(experience)
        if (positionLevel) jobPosting.positionLevel = EnumPositionLevel(positionLevel)
        if (minAge) jobPosting.minAge = minAge
        if (maxAge) jobPosting.maxAge = maxAge
        if (sex) jobPosting.sex = EnumSex(sex)
        else if (sex === null) jobPosting.sex = null;
        if (numberOfVacancies) jobPosting.numberOfVacancies = numberOfVacancies
        if (trialPeriod) jobPosting.trialPeriod = trialPeriod
        if (applicationDeadline) jobPosting.applicationDeadline = new Date(moment(applicationDeadline).format("YYYY-MM-DD"));
        if (minSalary) jobPosting.minSalary = minSalary
        if (maxSalary) jobPosting.maxSalary = maxSalary
        if (skills) jobPosting.skills = skills
        if (jobDescription) jobPosting.jobDescription = jobDescription
        if (jobRequirements) jobPosting.jobRequirements = jobRequirements
        if (benefits) jobPosting.benefits = benefits
        if (isHidden !== null) jobPosting.isHidden = isHidden
        if (requiredSkills) jobPosting.requiredSkills = requiredSkills
        if (keywords) jobPosting.keywords = keywords
        jobPosting.status = approvalStatus.pending
        jobPosting.updateAt = new Date()
        jobPosting.check = null

        await jobPostingRepository.save(jobPosting);

        await NotificationServices.handleCreateNewNotification(employerId, `Bạn đã cập nhật tin tuyển dụng  ${jobPosting.jobTitle}`);

        return jobPosting;
    }

    static handleCreateNewJobPosting = async (employerId, req) => {
        // Check parameters
        if (!req?.body?.name || !req?.body?.email || !req?.body?.phone || !req?.body?.contactAddress) {
            throw new HttpException(400, 'body is required');
        }
        if (!req?.body?.jobTitle || !req?.body?.profession || !req?.body?.employmentType || !req?.body?.degree || !req?.body?.experience ||
            !req?.body?.positionLevel || !req?.body?.numberOfVacancies || !req?.body?.applicationDeadline) {
            throw new HttpException(400, 'body is required');
        }
        if (!req?.body?.workAddress || !req?.body?.minSalary || !req?.body?.maxSalary) {
            throw new HttpException(400, 'body is required');
        }
        if (!req?.body?.jobDescription || !req?.body?.jobRequirements || !req?.body?.benefits) {
            throw new HttpException(400, 'body is required');
        }
        try {
            // Create new post
            const post = jobPostingRepository.create({
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
                numberOfVacancies: req.body.numberOfVacancies,
                trialPeriod: req.body.trialPeriod ? req.body.trialPeriod : null,
                applicationDeadline: new Date(moment(req.body.applicationDeadline, "DD-MM-YYYY").format("MM-DD-YYYY")),
                minSalary: req.body.minSalary,
                maxSalary: req.body.maxSalary,
                skills: req.body.skills ? req.body.skills : null,
                jobDescription: req.body.jobDescription,
                jobRequirements: req.body.jobRequirements,
                benefits: req.body.benefits,
                submissionCount: 0,
                view: 0,
                isHidden: req?.body?.isHidden ? req.body.isHidden : false,
                requiredSkills: req.body?.requiredSkills ? req.body?.requiredSkills : null,
                keywords: req.body?.keywords ? req.body?.keywords : null,
                employer: { userId: employerId}
            })
            await jobPostingRepository.save(post);

            await NotificationServices.handleCreateNewNotification(employerId, 'Đăng tuyển của bạn đang chờ duyệt');
          
            return post;
        } catch (err) {
            if (err.code === MySQLErrorCode.INVALID_RELATION_KEY || err.code === MySQLErrorCode.INVALID_RELATION_KEY2) {
                throw new HttpException(404, 'Employer not found')
            }
            throw err;
        }
    }

    static handleDeleteJobPosting = async (employerId, postId ) => {
        const jobPosting = await jobPostingRepository.findOne({
            where: { postId: postId },
            relations: ['employer']
        })
        if (!jobPosting) throw new HttpException(404, `No Job posting matches postId: ${postId}`)
        if (jobPosting.employer.userId !== employerId) {
            throw new HttpException(403, `You aren't a owner of jobPosting with postId: ${postId}`)
        }

        return await jobPostingRepository.remove(jobPosting);
    }

    static handleUpdateApprovalStatus = async (postId, dto) => {
        const { status, check } = dto;
        const jobPosting = await jobPostingRepository.findOne({
            where: { postId: postId },
            relations: ['employer']
        })
        if (!jobPosting) throw new HttpException(404, `No Job posting matches postId: ${postId}`)

        // Update with dto
        if (status) jobPosting.status = EnumApprovalStatus(status);
        if (check !== null) jobPosting.check = check;

        return await jobPostingRepository.save(jobPosting);

    }
}
