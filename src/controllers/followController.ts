import { HttpException } from "../exceptions/httpException";
import FollowServices from "../services/followServices";


export default class FollowController {
    static followCompany = async (req, res, next) => {
        try {
            const { employerId } = req.body
            if (!employerId) throw new HttpException(400, 'EmployerId required');
            const message = await FollowServices.handleFollowCompany(req.user, employerId);
            return res.status(200).json({message: message, data: []});
        } catch (error) {
            next(error);
        }
    }

    static saveEmployee = async (req, res, next) => {
        try {
            const { employeeId, isOnlineProfile } = req.body;
            if (!employeeId || !isOnlineProfile) throw new HttpException(400, 'EmployeeId, isOnlineProfile required');
            const message = await FollowServices.handleSaveEmployee(req.user, employeeId, isOnlineProfile);
            return res.status(200).json({message: message, data: []});
        } catch (error) {
            next(error);
        }
    }

    static getFollowByEmployee = async (req, res, next) => {
        try {
            const data = await FollowServices.handleGetFollowByEmployee(req.user);
            return res.status(200).json({message: "OK", data: data});
        } catch (error) {
            next(error);
        }
    }

    static getSaveEmployeeByEmployer = async (req, res, next) => {
        try {
            const data = await FollowServices.handleGetSaveEmployeeByEmployer(req.user);
            return res.status(200).json({message: "OK", data: data});
        } catch (error) {
            next(error);
        }
    }

    static followJobPosting = async (req, res, next) => {
        try {
            const { jobPosting } = req.body;
            if (!jobPosting) throw new HttpException(400, 'Job posting required');
            const message = await FollowServices.handleFollowJobPosting(req.user, jobPosting)
            return res.status(200).json({
                message: message,
                data: []
            });
        } catch (error) {
            next(error);
        }
    }

    static getFollowJobPosting = async (req, res, next) => {
        try {
            const data = await FollowServices.handleGetFollowJobPosting(req.user)
            return res.status(200).json({message: "OK", data: data});
        } catch (error) {
            next(error);
        }
    }
}