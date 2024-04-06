import { JobPosting } from "../entity/JobPosting"
import { myDataSource } from "../config/connectDB";
import { monthMap, userRole } from "../utils/enum";
import { User } from "../entity/Users";
import { OnlineProfile } from "../entity/OnlineProfile";
import { AttachedDocument } from "../entity/AttachedDocument";
import { countCandidatesbyProfession, mergerTwoObject } from "../utils/utilsFunction";
import { Int32 } from "typeorm";

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

        return ({
            message: 'OK',
            status: 200,
            data: formattedResults
        })
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

        return ({
            message: 'OK',
            status: 200,
            data: top5AndOther
        })
    }

    static handleGetAllUser = async (req) => {
        const { page, num, role } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(num);
        const take = parseInt(num);

        if (role) {
            const findAllUser = await userRepository.find({
                where: { role: userRole[role] },
                select: ['userId', 'email', 'name', 'dob', 'address', 'phone', 'sex', 'role', 'avatar'],
                skip: skip,
                take: take
            })

            return ({
                message: 'OK',
                status: 200,
                data: findAllUser
            })
        }

        const findAllUser = await userRepository.find({
            select: ['userId', 'email', 'name', 'dob', 'address', 'phone', 'sex', 'role', 'avatar'],
            skip: skip,
            take: take
        })

        return ({
            message: 'OK',
            status: 200,
            data: findAllUser
        })
    }

    static handleGetTotalUser = async (req) => {
        const { role } = req.query;

        if (role) {
            const findAllUser = await userRepository.find({
                where: { role: userRole[role] }
            })

            return ({
                message: 'OK',
                status: 200,
                data: findAllUser.length
            })
        }

        const findAllUser = await userRepository.find()

        return ({
            message: 'OK',
            status: 200,
            data: findAllUser.length
        })
    }
}