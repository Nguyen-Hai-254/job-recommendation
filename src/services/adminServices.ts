import { Brackets, ILike } from "typeorm"
import { myDataSource } from "../config/connectDB"
import { User, JobPosting, OnlineProfile, AttachedDocument } from "../entities"
import { approvalStatus, monthMap} from "../utils/enum"
import { countCandidatesbyProfession, createArrayForDate, mergerTwoObject } from "../utils/utilsFunction"
import MailServices from "./mailServices"
import { SortDirection } from "../utils/enums/sort-direction.enum"
import { HttpException } from "../exceptions/httpException"

const jobPostingRepository = myDataSource.getRepository(JobPosting);
const userRepository = myDataSource.getRepository(User);
const online_profileRepository = myDataSource.getRepository(OnlineProfile);
const attachedDocumentRepository = myDataSource.getRepository(AttachedDocument);

export default class AdminServices {
    static handleGetJobPostingsReport = async () => {
        const currentDate = new Date();
        const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);

        const getReport = await jobPostingRepository.createQueryBuilder('job-postings')
            .select('DATE_FORMAT(job-postings.createAt, "%Y-%m") AS monthYear, COUNT(*) AS count')
            .where('job-postings.createAt <= :currentDate AND job-postings.createAt > :sixMonthsAgo', {
                currentDate: currentDate.toISOString(),
                sixMonthsAgo: sixMonthsAgo.toISOString(),
            })
            .groupBy('monthYear')
            .orderBy('monthYear')
            .getRawMany();

        const formattedResults = getReport.map((result: any) => {
            const [year, month] = result.monthYear.split('-');
            const monthAbbreviation = monthMap[month];
            return { name: `${monthAbbreviation}`, value: result.count };
        });

        return formattedResults ? formattedResults : [];
    }

    static handleCandidateStatistics = async () => {
        const getAllOnlineProfile = await online_profileRepository.createQueryBuilder('profile')
            .select('profile.profession AS profession, COUNT(*) AS userCount')
            .groupBy('profile.profession')
            .getRawMany()

        const getAllAttachedDocument = await attachedDocumentRepository.createQueryBuilder('profile')
            .select('profile.profession AS profession, COUNT(*) AS userCount')
            .groupBy('profile.profession')
            .getRawMany()

        const resultOnlineProlife = countCandidatesbyProfession(getAllOnlineProfile);
        const resultAttachedDocument = countCandidatesbyProfession(getAllAttachedDocument);

        const totalResult = mergerTwoObject(resultOnlineProlife, resultAttachedDocument);
        // Chuyển đổi totalResult thành mảng objects
        let result = Object.entries(totalResult).map(([profession, count]) => ({
            name: profession,
            value: count
        }));

        const sortedData = result.sort((a: { name, value }, b: { name, value }) => b.value - a.value);

        const top5 = sortedData.slice(0, 5);
        const otherSum = sortedData.reduce((sum, currenItem: { name, value }) => sum + currenItem.value, 0) - top5.reduce((sum, currenItem: { name, value }) => sum + currenItem.value, 0)

        const top5AndOther = [...top5, { "name": "Khác", value: otherSum }];

        return top5AndOther ? top5AndOther : [];
    }

    static handleGetAllUser = async (reqQuery) => {
        const { page, num, role, keyword, orderBy, sort } = reqQuery;
        let query = userRepository.createQueryBuilder('user');

        if (role) {
            query = query.where('user.role = :role', { role })
        }

        if (keyword) {
            query = query.andWhere(
                new Brackets(qb =>
                    qb.where('user.name ILike :keyword', { keyword: `%${keyword}%` })
                        .orWhere('user.email ILike :keyword', { keyword: `%${keyword}%` })
                )
            );
        }

         // sort
        if (orderBy) {
            if (!SortDirection.hasOwnProperty(sort)) throw new HttpException(400, 'Invalid sort');
            switch (orderBy) {
                case 'name': case 'email': case 'dob': case 'phone': case 'sex': case 'role':
                    query= query.orderBy(`user.${orderBy}`, sort)
                    break;
                default:
                    throw new HttpException(400, 'Invalid order by');
            }
        } else {
            query= query.orderBy(`user.name`, "ASC")
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

    static handleSendEmail = async (emails, subject, html) => {
        const info = await MailServices.sendEmailForUsers(emails, subject, html);
        return { accepted: info.accepted, rejected: info.rejected }
    }

    static handleSearchEmailOrName = async (keyword) => {
        const findUser = await userRepository.find({
            where: [
                {
                    name: ILike(`%${keyword}%`)
                },
                {
                    email: ILike(`%${keyword}%`)
                }
            ],
            select: ['userId', 'email', 'name', 'role'],
            take: 6
        })

        return findUser;
    }

    static handleGetJobPostingsReportByQuery = async (year, month) => {
        if (!month) {
            const getReport = await jobPostingRepository.createQueryBuilder('job-postings')
                .select('DATE_FORMAT(job-postings.createAt, "%b") AS time, COUNT(*) AS value')
                .where('YEAR(job-postings.createAt) = :year and (job-postings.status = :approved or job-postings.status = :expired)', { year, approved: approvalStatus.approved, expired: approvalStatus.expired })
                .groupBy('time')
                .orderBy('job-postings.createAt')
                .getRawMany();

            return getReport;
        } else {
            const getReport = await jobPostingRepository.createQueryBuilder('job-postings')
                .select('DATE_FORMAT(job-postings.createAt, "%e") AS time, COUNT(*) AS value')
                .where('YEAR(job-postings.createAt) = :year and MONTH(job-postings.createAt) = :month and (job-postings.status = :approved or job-postings.status = :expired)', { year, month, approved: approvalStatus.approved, expired: approvalStatus.expired })
                .groupBy('time')
                .orderBy('job-postings.createAt')
                .getRawMany();

            const daysInMonth = createArrayForDate(month, year) // Tạo một mảng các ngày
            getReport.map(day => {
                daysInMonth[day.time - 1].value = day.value
            })

            return daysInMonth;
        }
    }

    static handleCandidateStatisticsByQuery = async (year, month) => {
        let queryAllOnlineProfile = online_profileRepository.createQueryBuilder('profile')
            .select('profile.profession AS profession, COUNT(*) AS userCount')
            .where('YEAR(profile.updateAt) = :year', { year })
            .groupBy('profile.profession')

        let queryAllAttachedDocument = attachedDocumentRepository.createQueryBuilder('profile')
            .select('profile.profession AS profession, COUNT(*) AS userCount')
            .where('YEAR(profile.updateAt) = :year', { year })
            .groupBy('profile.profession')

        if (month) {
            queryAllOnlineProfile = queryAllOnlineProfile.andWhere('MONTH(profile.updateAt) = :month', { month })
            queryAllAttachedDocument = queryAllAttachedDocument.andWhere('MONTH(profile.updateAt) = :month', { month })
        }

        let getAllOnlineProfile = await queryAllOnlineProfile.getRawMany()
        let getAllAttachedDocument = await queryAllAttachedDocument.getRawMany()

        if (getAllOnlineProfile.length === 0 && getAllAttachedDocument.length === 0) {
            return []
        }

        const resultOnlineProlife = countCandidatesbyProfession(getAllOnlineProfile);
        const resultAttachedDocument = countCandidatesbyProfession(getAllAttachedDocument);

        const totalResult = mergerTwoObject(resultOnlineProlife, resultAttachedDocument);
        // Chuyển đổi totalResult thành mảng objects
        let result = Object.entries(totalResult).map(([profession, count]) => ({
            name: profession,
            value: count
        }));

        const sortedData = result.sort((a: { name, value }, b: { name, value }) => b.value - a.value);

        const top5 = sortedData.slice(0, 5);
        const otherSum = sortedData.reduce((sum, currenItem: { name, value }) => sum + currenItem.value, 0) - top5.reduce((sum, currenItem: { name, value }) => sum + currenItem.value, 0)

        const top5AndOther = [...top5, { "name": "Khác", value: otherSum }];

        return top5AndOther ? top5AndOther : [];
    }
}