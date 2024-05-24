import { myDataSource } from "../config/connectDB"
import { User, Application, JobPosting, AttachedDocument, OnlineProfile } from "../entities"
import { MySQLErrorCode, applicationType } from "../utils/enum"
import { EnumApplicationType, EnumApprovalStatus } from "../utils/enumAction"
import { HttpException } from "../exceptions/httpException"

const userRepository = myDataSource.getRepository(User);
const applicationRepository = myDataSource.getRepository(Application);
const jobpostingRepository = myDataSource.getRepository(JobPosting);
const attached_documentRepository = myDataSource.getRepository(AttachedDocument);
const online_profileRepository = myDataSource.getRepository(OnlineProfile);

export default class ApplicationServices {
    static handleGetApplicationsbyEmployee = async (userId, reqQuery) => {
        const { num, page } = reqQuery;

        // get list of applications by employee
        let query = applicationRepository
            .createQueryBuilder('application')
            .select([
                'application.application_id','application.applicationType', 'application.createAt', 'application.CV', 'application.name', 'application.email', 'application.phone', 'application.status', 
                'jobPosting.jobTitle','jobPosting.postId', 'jobPosting.applicationDeadline',
                'employer.companyName'
            ])
            .leftJoin('application.employee','employee')
            .leftJoin('application.jobPosting', 'jobPosting')
            .leftJoin('jobPosting.employer', 'employer')
            .where('employee.userId = :userId', { userId: userId });
     
        // Pagination
        query = query.skip((Number(page)-1) * Number(num)).take(Number(num));

         const [items, totalItems] = await query.getManyAndCount();
         const totalPages = Math.ceil(totalItems / num);
  
        return  {
            items: items,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: num,
                totalPages,
                currentPage: page
            }
        }   
    }

    static handleGetApplication = async (id) => {
        const application = await applicationRepository.findOne({
            where: { application_id: id },
            relations: ['employee']
        })
        if (!application) throw new HttpException(404, "Application not found");

        return application;
    }

    static handleCreateNewApplication = async (userId, dto) => {
        if (!dto.applicationType || !dto.postId) throw new HttpException(400, 'applicationType and postId are required');
        if (!dto.CV || !dto.name || !dto.email || !dto.phone) throw new HttpException(400, 'CV,name,email, phone are required');
        
        // Check applicationType is correct
        if (EnumApplicationType(dto.applicationType) === applicationType.attached_document) {
            const attached_document = await attached_documentRepository.findOneBy({ userId: userId });
            if (!attached_document) throw new HttpException(404, 'attached Document not found');
        }
        else if (EnumApplicationType(dto.applicationType) === applicationType.online_profile) {
            const online_profile = await online_profileRepository.findOneBy({ userId: userId });
            if (!online_profile) throw new HttpException(404, 'online profile not found');
        }

        try {
            // Create new application
            const application = applicationRepository.create({
                applicationType: EnumApplicationType(dto.applicationType),
                CV: dto.CV,
                name: dto.name,
                email: dto.email,
                phone: dto.phone,
                keywords: dto.keywords ? dto.keywords : null,
                employee: { userId: userId},
                jobPosting: { postId: dto.postId }
            });
            const result = await applicationRepository.save(application);
            return result;
        } catch (err) {
            if (err.code === MySQLErrorCode.INVALID_RELATION_KEY || err.code === MySQLErrorCode.INVALID_RELATION_KEY2) {
                throw new HttpException(404, 'Employee, Job posting Not Found')
            }
            throw err;
        }

    }

    static handleGetApplicationsbyEmployer = async (userId, reqQuery) => {
        const { applicationType, name, status, postId, num, page} = reqQuery;
        // get list of applications by employer
        let query = applicationRepository
            .createQueryBuilder('application')
            .leftJoinAndSelect('application.employee','employee')
            .leftJoinAndSelect('employee.online_profile', 'online_profile', 'application.applicationType = :type1', { type1: 'Nộp trực tuyến' })
            .leftJoinAndSelect('employee.attached_document', 'attached_document', 'application.applicationType = :type2', { type2: 'CV đính kèm' })
            .leftJoin('employee.user', 'user')
            .addSelect(['user.dob','user.address', 'user.sex', 'user.avatar'])
            .leftJoin('application.jobPosting', 'jobPosting')
            .where('jobPosting.employer_id = :userId', { userId: userId });
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
        query = query.skip((Number(page)-1) * Number(num)).take(Number(num));

        const [items, totalItems] = await query.getManyAndCount();
        const totalPages = Math.ceil(totalItems / num);
 
        return  {
            items: items,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: num,
                totalPages,
                currentPage: page
            }
        }

    }

    static handleGetApplicationbyEmployer = async (userId, id) => {
        
        const application = await applicationRepository.findOne({
            where: { application_id: id },
            relations: ['employee']
        })
        if (!application) throw new HttpException(404,'Application not found');

        // Check employer is owner of application
        const post = await jobpostingRepository.findOne({
            where: { applications: { application_id: id } },
            relations: ['applications', 'employer']
        })
        if (!post) throw new HttpException(404,'Post not found');
        
        if (post.employer.userId != userId) throw new HttpException(403, `You are not the owner of post has id: ${post.postId}`);

        // Find information about details of CV with applicationType: cv_enclosed, online-profile, attached-document
        // TH1: cv_enclosed
        if (application.applicationType === applicationType.cv_enclosed) {
            return { application }
        }
        // Find personal information about employee of application if applicationType != cv_enclosed
        const user = await userRepository.findOne({
            where: { userId: application.employee.userId },
            relations: ['employee']
        })
        if (!user) throw new HttpException(404, 'Personal information of user not found');
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
            if (!attached_document) throw new HttpException(404, 'Not Found attached document');
            return { application, personal_information, attached_document };
        }
        // TH3 : online_profile 
        const online_profile = await online_profileRepository.findOne({
            where: { userId: application.employee.userId },
            relations: ['another_degrees', 'education_informations', 'work_experiences']
        })
        if (!online_profile) throw new HttpException(404, 'Not Found online profile');
        return { application, personal_information, online_profile }
        

    }

    static handleUpdateApplicationbyEmployer = async (userId, id, dto) => {
      
        const application = await applicationRepository.findOne({
            where: { application_id: id },
            relations: ['employee']
        })
        if (!application) throw new HttpException(404,'Application not found');
        // Check employer is owner of application
        const post = await jobpostingRepository.findOne({
            where: { applications: { application_id: id } },
            relations: ['applications', 'employer']
        })
        if (!post) throw new HttpException(404,'Post not found');
        
        if (post.employer.userId != userId) throw new HttpException(403, `You are not the owner of post has id: ${post.postId}`);

        // Update with req.body
        if (dto.status) application.status = EnumApprovalStatus(dto.status)
        if (dto.matchingScore) application.matchingScore = dto.matchingScore

        await applicationRepository.save(application)

        return application
    }

    static handleGetApplicationsByAdmin = async (reqQuery) => {
        const { applicationType, name, status, postId, num, page} = reqQuery;
        // get list of applications by employer
        let query = applicationRepository
            .createQueryBuilder('application')
            .select(['application', 'employee.userId', 'jobPosting.postId'])
            .leftJoin('application.employee','employee')
            .leftJoin('application.jobPosting', 'jobPosting')
            .leftJoin('jobPosting.employer', 'employer')
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
        query = query.skip((Number(page)-1) * Number(num)).take(Number(num));

        const [items, totalItems] = await query.getManyAndCount();
        const totalPages = Math.ceil(totalItems / num);
 
        return  {
            items: items,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: num,
                totalPages,
                currentPage: page
            }
        }

    }
}

