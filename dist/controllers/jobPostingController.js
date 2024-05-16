"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const jobpostingServices_1 = __importDefault(require("../services/jobpostingServices"));
class JobPostingController {
}
_a = JobPostingController;
JobPostingController.getAllJobPostings = async (req, res) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetAllJobPostings(req);
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
JobPostingController.getLengthOfAllJobPostings = async (req, res) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetLengthOfAllJobPostings(req);
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
JobPostingController.getAllJobPostingsByAdmin = async (req, res) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetAllJobPostingsByAdmin(req);
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
JobPostingController.getLengthOfAllJobPostingsByAdmin = async (req, res) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetLengthOfAllJobPostingsByAdmin(req);
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
JobPostingController.getTotalResultsOfProfession = async (req, res) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetTotalResultsOfProfession();
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
JobPostingController.getTotalResultsOfProfessionByAdmin = async (req, res) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetTotalResultsOfProfessionByAdmin(req);
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
JobPostingController.getJobPostingsByEmployer = async (req, res) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetJobPostingsByEmployer(req);
        return res.status(jobPostings.status).json({
            message: jobPostings.message,
            status: 200,
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
JobPostingController.getJobPosting = async (req, res) => {
    try {
        const jobPosting = await jobpostingServices_1.default.handleGetJobPosting(req);
        return res.status(jobPosting.status).json({
            message: jobPosting.message,
            status: jobPosting.status,
            data: jobPosting.data
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
JobPostingController.getJobPostingByEmployer = async (req, res) => {
    try {
        const jobPosting = await jobpostingServices_1.default.handleGetJobPostingByEmployer(req);
        return res.status(jobPosting.status).json({
            message: jobPosting.message,
            status: jobPosting.status,
            data: jobPosting.data
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
JobPostingController.deleteJobPosting = async (req, res) => {
    try {
        const jobPosting = await jobpostingServices_1.default.handleDeleteJobPosting(req);
        return res.status(jobPosting.status).json({
            message: jobPosting.message,
            status: jobPosting.status,
            data: jobPosting.data
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
JobPostingController.updateJobPosting = async (req, res) => {
    try {
        const jobPosting = await jobpostingServices_1.default.handleUpdateJobPosting(req);
        return res.status(jobPosting.status).json({
            message: jobPosting.message,
            status: jobPosting.status,
            data: jobPosting.data
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
JobPostingController.createNewJobPosting = async (req, res) => {
    try {
        const jobPosting = await jobpostingServices_1.default.handleCreateNewJobPosting(req);
        return res.status(jobPosting.status).json({
            message: jobPosting.message,
            status: jobPosting.status,
            data: jobPosting.data
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
JobPostingController.updateApprovalStatus = async (req, res) => {
    try {
        const post = await jobpostingServices_1.default.handleUpdateApprovalStatus(req);
        return res.status(post.status).json({
            message: post.message,
            status: post.status,
            data: post.data
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
exports.default = JobPostingController;
//# sourceMappingURL=jobPostingController.js.map