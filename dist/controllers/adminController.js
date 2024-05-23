"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const httpException_1 = require("../exceptions/httpException");
const adminServices_1 = __importDefault(require("../services/adminServices"));
const respondSuccess_1 = __importDefault(require("../utils/respondSuccess"));
class AdminController {
}
_a = AdminController;
AdminController.jobPostingsReport = async (req, res, next) => {
    try {
        const jobPostings = await adminServices_1.default.handleGetJobPostingsReport();
        return (0, respondSuccess_1.default)(res, 'OK', jobPostings);
    }
    catch (error) {
        next(error);
    }
};
AdminController.candidateStatistics = async (req, res, next) => {
    try {
        const data = await adminServices_1.default.handleCandidateStatistics();
        return (0, respondSuccess_1.default)(res, 'OK', data);
    }
    catch (error) {
        next(error);
    }
};
AdminController.getAllUser = async (req, res, next) => {
    try {
        const allUser = await adminServices_1.default.handleGetAllUser(req.query);
        return (0, respondSuccess_1.default)(res, 'OK', allUser);
    }
    catch (error) {
        next(error);
    }
};
AdminController.sendEmail = async (req, res, next) => {
    try {
        const { emails, subject, html } = req.body;
        if (!emails || !subject || !html)
            throw new httpException_1.HttpException(400, 'Missing input parameter!');
        const result = await adminServices_1.default.handleSendEmail(emails, subject, html);
        return (0, respondSuccess_1.default)(res, 'OK', result);
    }
    catch (error) {
        next(error);
    }
};
AdminController.searchEmailOrName = async (req, res, next) => {
    try {
        const { keyword } = req.body;
        if (!keyword)
            throw new httpException_1.HttpException(400, 'Missing input parameter!');
        const result = await adminServices_1.default.handleSearchEmailOrName(req.body.keyword);
        return (0, respondSuccess_1.default)(res, 'OK', result);
    }
    catch (error) {
        next(error);
    }
};
AdminController.getJobPostingsReportByQuery = async (req, res, next) => {
    try {
        const { year, month } = req.query;
        if (!year)
            throw new httpException_1.HttpException(400, 'Missing year!');
        const result = await adminServices_1.default.handleGetJobPostingsReportByQuery(year, month);
        return (0, respondSuccess_1.default)(res, 'OK', result);
    }
    catch (error) {
        next(error);
    }
};
AdminController.candidateStatisticsByQuery = async (req, res, next) => {
    try {
        const { year, month } = req.query;
        if (!year)
            throw new httpException_1.HttpException(400, 'Missing year!');
        const result = await adminServices_1.default.handleCandidateStatisticsByQuery(year, month);
        return (0, respondSuccess_1.default)(res, 'OK', result);
    }
    catch (error) {
        next(error);
    }
};
exports.default = AdminController;
//# sourceMappingURL=adminController.js.map