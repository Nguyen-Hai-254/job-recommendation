import { myDataSource } from "../config/connectDB";
import { Employee, Employer, JobPosting, Follow, Save } from "../entities";
import { approvalStatus } from "../utils/enum";
import { HttpException } from "../exceptions/httpException";
import { EntityManager } from "typeorm";

const employeeRepository = myDataSource.getRepository(Employee);
const employerRepository = myDataSource.getRepository(Employer);
const followRepository = myDataSource.getRepository(Follow);
const saveRepository = myDataSource.getRepository(Save);
const jobPostingRepository = myDataSource.getRepository(JobPosting);

export default class FollowServices {
    static handleFollowCompany = async (user, employerId) => {
        let findUser = await employeeRepository.findOne({
            where: { userId: user.userId },
            relations: ['follow']
        })

        if (!findUser) throw new HttpException(404, 'User not found')

        let findEmployer = await employerRepository.findOne({
            where: { userId: employerId }
        })
        if (!findEmployer) throw new HttpException(404, 'Employer not found')

        const find = findUser.follow.findIndex((follow) => follow.employerId == employerId);

        if (find !== -1) {
            await followRepository.delete({
                employeeId: findUser.userId,
                employerId: findEmployer.userId
            })
        }
        else {
            const createFollow = followRepository.create({
                employeeId: findUser.userId,
                employerId: findEmployer.userId
            })

            await followRepository.save(createFollow);
        };

        return find !== -1 ? 'Đã bỏ theo dõi công ty' : 'Đã theo dõi công ty';
            
    }

    static handleSaveEmployee = async (user, emloyeeId, isOnlineProfile) => {
        let findEmployer = await employerRepository.findOne({
            where: {
                userId: user.userId
            },
            relations: ['saveEmployee']
        })

        if (!findEmployer) throw new HttpException(404, 'Employer not found')

        const findEmployee = await employeeRepository.findOne({
            where: { userId: emloyeeId }
        })
        if (!findEmployee) throw new HttpException(404, 'Employee not found')

        const find = findEmployer.saveEmployee.filter(save => save.employerId == user.userId && save.employeeId == emloyeeId && save.isOnlineProfile == isOnlineProfile);

        if (find.length > 0) {
            await saveRepository.remove(find);

            return 'Đã bỏ lưu hồ sơ';
        }
        else {
            const createSave = saveRepository.create({
                employeeId: findEmployee.userId,
                employerId: findEmployer.userId,
                isOnlineProfile: isOnlineProfile == '1' ? true : false
            })
            await saveRepository.save(createSave);
            return 'Đã lưu hồ sơ';   
        };
    }

    static handleGetFollowByEmployee = async (user, reqQuery) => {
        const { companyIds, num, page } = reqQuery;

        let query = followRepository.createQueryBuilder('follow')
            .leftJoinAndSelect('follow.employer', 'employer')
            .where('follow.employeeId = :employeeId', { employeeId: user.userId })

        if (companyIds) {
            const ArrayCompanyIds: number[] = companyIds.split(',').map(companyId => Number(companyId));
            query = query.andWhere('follow.employerId IN (:...ArrayCompanyIds)' , {ArrayCompanyIds});
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
                itemsPerPage: +num,
                totalPages,
                currentPage: +page
            }
        }  
    }

    static handleGetSaveEmployeeByEmployer = async (user, reqQuery) => {
        const { num, page } = reqQuery;
       
        const [items ,totalItems] = await saveRepository.findAndCount({
            where: {
                employerId: user.userId,
            },
            relations: ['employee.user', 'employee.online_profile', 'employee.attached_document'],
            order: {
                createAt: 'DESC'
            },
            skip: (Number(page)-1) * Number(num),
            take: Number(num)
        })

        const transformedItems =items.map(save => {
            if ((save.isOnlineProfile && save.employee.online_profile && !save.employee.online_profile.isHidden) || (!save.isOnlineProfile && save.employee.attached_document && !save.employee.attached_document.isHidden))
                return ({
                    userId: save.employee.user.userId,
                    name: save.employee.user.name,
                    createAt: save.createAt,
                    avatar: save.employee.user.avatar,
                    isOnlineProfile: save.isOnlineProfile,
                    file: {
                        jobTitle: save.isOnlineProfile ? save.employee.online_profile?.jobTitle : save.employee.attached_document?.jobTitle,
                        desiredSalary: save.isOnlineProfile ? save.employee.online_profile?.desiredSalary : save.employee.attached_document?.desiredSalary,
                        profession: save.isOnlineProfile ? save.employee.online_profile?.profession : save.employee.attached_document?.profession,
                        currentPosition: save.isOnlineProfile ? save.employee.online_profile?.currentPosition : save.employee.attached_document?.currentPosition,
                        experience: save.isOnlineProfile ? save.employee.online_profile?.experience : save.employee.attached_document?.experience,
                        degree: save.isOnlineProfile ? save.employee.online_profile?.degree : save.employee.attached_document?.degree,
                        skills: save.isOnlineProfile ? save.employee.online_profile?.skills : save.employee.attached_document?.skills,
                    }
                })
            else return  ({
                userId: save.employee.user.userId,
                name: save.employee.user.name,
                createAt: save.createAt,
                avatar: save.employee.user.avatar,
                isOnlineProfile: save.isOnlineProfile,
                file: null
            });
        })
        const totalPages = Math.ceil(totalItems / num);
        return  {
            items: transformedItems,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: +num,
                totalPages,
                currentPage: +page
            }
        }  
    }

    static handleFollowJobPosting = async (user, jobId) => {
        const findEmployee = await employeeRepository.findOne({
            where: { userId: user.userId },
            relations: ['jobs']
        })
        if (!findEmployee) throw new HttpException(404, 'Employee not found')

        const findJobPosing = await jobPostingRepository.findOneBy({
            postId: jobId
        })
        if (!findJobPosing) throw new HttpException(404, 'Job posting not found')

        if (findJobPosing.status === approvalStatus.pending || findJobPosing.status === approvalStatus.rejected || findJobPosing.isHidden) {
            throw new HttpException(403, 'Bạn không thể theo dõi đăng tuyển này')
        }

        let findFollow = -1;
        if (findEmployee.jobs.length !== 0) {
            findFollow = findEmployee.jobs.findIndex((job) => job.postId == jobId)
        }

        if (findFollow === -1) {
            findEmployee.jobs.push(findJobPosing);
        }
        else {
            delete findEmployee.jobs[findFollow];
        }
        await employeeRepository.save(findEmployee);

        return findFollow === -1 ? 'Theo dõi đăng tuyển thành công' : 'Đã bỏ theo dõi đăng tuyển';
    }

    static handleGetFollowJobPosting = async (user, reqQuery) => {
        const entityManager = myDataSource.manager as EntityManager;

        const { jobIds, num, page } = reqQuery;
        
        let queryByJobIds = jobIds ? `AND fj.postId IN (${jobIds})` : ``;

        let query = `
            SELECT 
                fj.postId,
                jp.jobTitle,
                jp.minSalary,
                jp.maxSalary,
                jp.workAddress,
                jp.createAt,
                employer.companyName,
                employer.logo,
                COUNT(*) OVER() AS totalItems
            FROM \`follow-job\` fj 
            INNER JOIN job_posting jp
            ON fj.postId = jp.postId
            INNER JOIN employer
            ON jp.employer_id = employer.userId
            WHERE fj.userId = ${user.userId}
                ${ queryByJobIds }
                AND jp.isHidden = false
                AND jp.status = '${approvalStatus.approved}'
            LIMIT ${ parseInt(num)}
            OFFSET ${(parseInt(page) - 1) * parseInt(num)} 
        `;

        const result = await entityManager.query(query);
        const totalItems = result.length ? Number(result[0].totalItems) : 0;
        const items = result.length ? result.map(({ totalItems, ...rest }) => rest): [];
    
        const totalPages = Math.ceil(totalItems / num);
        return  {
            items: items,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: +num,
                totalPages,
                currentPage: +page
            }
        }
        
    }
}