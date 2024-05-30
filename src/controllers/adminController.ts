import { HttpException } from "../exceptions/httpException";
import AdminServices from "../services/adminServices";
import respondSuccess from "../utils/respondSuccess";

export default class AdminController {
    static jobPostingsReport = async (req, res, next) => {
        try {
            const jobPostings = await AdminServices.handleGetJobPostingsReport();
            return respondSuccess(res, 'OK', jobPostings);
        } catch (error) {
            next(error);
        }
    }

    static candidateStatistics = async (req, res, next) => {
        try {
            const data = await AdminServices.handleCandidateStatistics();
            return respondSuccess(res, 'OK', data);
        } catch (error) {
            next(error);
        }
    }

    static getAllUser = async (req, res, next) => {
        try {
            const allUser = await AdminServices.handleGetAllUser(req.query);
            return respondSuccess(res, 'OK', allUser);
        } catch (error) {
            next(error);
        }
    }

    static getAllEmail = async (req, res, next) => {
        try {
            const getAllEmail = await AdminServices.handleGetAllEmail(req.query);
            return respondSuccess(res, 'OK', getAllEmail);
        } catch (error) {
            next(error);
        }
    }

    static sendEmail = async (req, res, next) => {
        try {
            const { emails, subject, html } = req.body;
            if (!emails || !subject || !html) throw new HttpException(400, 'Missing input parameter!');
          
            const result = await AdminServices.handleSendEmail(emails, subject, html);
            return respondSuccess(res, 'OK', result);
        } catch (error) {
            next(error);
        }
    }

    static searchEmailOrName = async (req, res, next) => {
        try {
            const { keyword } = req.body;
            if (!keyword) throw new HttpException(400, 'Missing input parameter!');

            const result = await AdminServices.handleSearchEmailOrName(req.body.keyword);
            return respondSuccess(res, 'OK', result);
        } catch (error) {
            next(error);
        }
    }

    static getJobPostingsReportByQuery = async (req, res, next) => {
        try {
            const { year, month } = req.query;
            if (!year) throw new HttpException(400, 'Missing year!');

            const result = await AdminServices.handleGetJobPostingsReportByQuery(year, month);
            return respondSuccess(res, 'OK', result);
        } catch (error) {
            next(error);
        }
    }

    static candidateStatisticsByQuery = async (req, res, next) => {
        try {
            const { year, month } = req.query;
            if (!year) throw new HttpException(400, 'Missing year!');

            const result = await AdminServices.handleCandidateStatisticsByQuery(year, month);
            return respondSuccess(res, 'OK', result);
        } catch (error) {
            next(error);
        }
    }
}