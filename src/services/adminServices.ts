import { ILike } from "typeorm"
import { myDataSource } from "../config/connectDB"
import { User, JobPosting, OnlineProfile, AttachedDocument } from "../entities"
import { approvalStatus, monthMap} from "../utils/enum"
import { countCandidatesbyProfession, createArrayForDate, mergerTwoObject } from "../utils/utilsFunction"
import MailServices from "./mailServices"

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

    static handleGetAllUser = async (req) => {
        const { page, num, role } = req.query;
        let query = userRepository.createQueryBuilder('user');

        if (role) {
            query = query.where('user.role = :role', { role })
        }

        // Pagination
        if (num && page) {
            const skip = (parseInt(page) - 1) * parseInt(num);
            const take = parseInt(num);

            query = query.skip(skip).take(take);
        }

        const findAllUser = await query.getMany();

        return findAllUser ? findAllUser: [];
    }

    static handleGetTotalUser = async (req) => {
        const { role } = req.query;
        let query = userRepository.createQueryBuilder('user');

        if (role) {
            query = query.where('user.role = :role', { role })
        }

        const findAllUser = await query.getCount();

        return findAllUser ? findAllUser: [];
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