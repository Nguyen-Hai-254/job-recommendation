import { JobPosting } from "../entity/JobPosting"
import moment from "moment"
import { myDataSource } from "../config/connectDB";
import { monthMap, userRole } from "../utils/enum";
import { User } from "../entity/Users";

const jobPostingRepository = myDataSource.getRepository(JobPosting);
const userRepository = myDataSource.getRepository(User);

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