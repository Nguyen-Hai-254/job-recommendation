"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const adminServices_1 = __importDefault(require("../services/adminServices"));
class AdminController {
}
_a = AdminController;
AdminController.jobPostingsReport = async (req, res) => {
    try {
        const jobPostings = await adminServices_1.default.handleGetJobPostingsReport();
        return res.status(jobPostings.status).json({
            message: jobPostings.message,
            status: jobPostings.status,
            data: jobPostings.data ? jobPostings.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
AdminController.candidateStatistics = async (req, res) => {
    try {
        const data = await adminServices_1.default.handleCandidateStatistics();
        return res.status(data.status).json({
            message: data.message,
            status: data.status,
            data: data.data ? data.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
AdminController.getAllUser = async (req, res) => {
    try {
        const allUser = await adminServices_1.default.handleGetAllUser(req);
        return res.status(allUser.status).json({
            message: allUser.message,
            status: allUser.status,
            data: allUser.data ? allUser.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
AdminController.getTotalUser = async (req, res) => {
    try {
        const totalUser = await adminServices_1.default.handleGetTotalUser(req);
        return res.status(totalUser.status).json({
            message: totalUser.message,
            status: totalUser.status,
            data: totalUser.data ? totalUser.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
AdminController.sendEmail = async (req, res) => {
    try {
        if (!req.body.emails || !req.body.subject || !req.body.html) {
            return res.status(400).json({
                message: "Missing input parameter!",
                status: 400,
                error: 'Internal Server Error',
            });
        }
        const result = await adminServices_1.default.handleSendEmail(req.body.emails, req.body.subject, req.body.html);
        return res.status(result.status).json({
            message: result.message,
            status: result.status,
            data: result.data ? result.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
AdminController.searchEmailOrName = async (req, res) => {
    try {
        if (!req.body.keyword) {
            return res.status(400).json({
                message: "Missing input parameter!",
                status: 400,
                error: 'Internal Server Error',
            });
        }
        const result = await adminServices_1.default.handleSearchEmailOrName(req.body.keyword);
        return res.status(result.status).json({
            message: result.message,
            status: result.status,
            data: result.data ? result.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
AdminController.getJobPostingsReportByQuery = async (req, res) => {
    try {
        if (!req.query.year) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const result = await adminServices_1.default.handleGetJobPostingsReportByQuery(req.query.year, req.query.month);
        return res.status(result.status).json({
            message: result.message,
            status: result.status,
            data: result.data ? result.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
AdminController.candidateStatisticsByQuery = async (req, res) => {
    try {
        if (!req.query.year) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const result = await adminServices_1.default.handleCandidateStatisticsByQuery(req.query.year, req.query.month);
        return res.status(result.status).json({
            message: result.message,
            status: result.status,
            data: result.data ? result.data : []
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
};
exports.default = AdminController;
//# sourceMappingURL=adminController.js.map