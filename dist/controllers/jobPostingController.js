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
JobPostingController.getAllJobPostings = async (req, res, next) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetAllJobPostings(req);
        return res.status(jobPostings.status).json({
            message: jobPostings.message,
            status: jobPostings.status,
            data: jobPostings.data ? jobPostings.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getLengthOfAllJobPostings = async (req, res, next) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetLengthOfAllJobPostings(req);
        return res.status(jobPostings.status).json({
            message: jobPostings.message,
            status: jobPostings.status,
            data: jobPostings.data ? jobPostings.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getAllJobPostingsByAdmin = async (req, res, next) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetAllJobPostingsByAdmin(req);
        return res.status(jobPostings.status).json({
            message: jobPostings.message,
            status: jobPostings.status,
            data: jobPostings.data ? jobPostings.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getLengthOfAllJobPostingsByAdmin = async (req, res, next) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetLengthOfAllJobPostingsByAdmin(req);
        return res.status(jobPostings.status).json({
            message: jobPostings.message,
            status: jobPostings.status,
            data: jobPostings.data ? jobPostings.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getTotalResultsOfProfession = async (req, res, next) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetTotalResultsOfProfession();
        return res.status(jobPostings.status).json({
            message: jobPostings.message,
            status: jobPostings.status,
            data: jobPostings.data ? jobPostings.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getTotalResultsOfProfessionByAdmin = async (req, res, next) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetTotalResultsOfProfessionByAdmin(req);
        return res.status(jobPostings.status).json({
            message: jobPostings.message,
            status: jobPostings.status,
            data: jobPostings.data ? jobPostings.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getJobPostingsByEmployer = async (req, res, next) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetJobPostingsByEmployer(req);
        return res.status(jobPostings.status).json({
            message: jobPostings.message,
            status: 200,
            data: jobPostings.data ? jobPostings.data : []
        });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getJobPosting = async (req, res, next) => {
    try {
        const jobPosting = await jobpostingServices_1.default.handleGetJobPosting(req);
        return res.status(jobPosting.status).json({
            message: jobPosting.message,
            status: jobPosting.status,
            data: jobPosting.data
        });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getJobPostingByEmployer = async (req, res, next) => {
    try {
        const jobPosting = await jobpostingServices_1.default.handleGetJobPostingByEmployer(req);
        return res.status(jobPosting.status).json({
            message: jobPosting.message,
            status: jobPosting.status,
            data: jobPosting.data
        });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.deleteJobPosting = async (req, res, next) => {
    try {
        const jobPosting = await jobpostingServices_1.default.handleDeleteJobPosting(req);
        return res.status(jobPosting.status).json({
            message: jobPosting.message,
            status: jobPosting.status,
            data: jobPosting.data
        });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.updateJobPosting = async (req, res, next) => {
    try {
        const jobPosting = await jobpostingServices_1.default.handleUpdateJobPosting(req);
        return res.status(jobPosting.status).json({
            message: jobPosting.message,
            status: jobPosting.status,
            data: jobPosting.data
        });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.createNewJobPosting = async (req, res, next) => {
    try {
        const jobPosting = await jobpostingServices_1.default.handleCreateNewJobPosting(req);
        return res.status(jobPosting.status).json({
            message: jobPosting.message,
            status: jobPosting.status,
            data: jobPosting.data
        });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.updateApprovalStatus = async (req, res, next) => {
    try {
        const post = await jobpostingServices_1.default.handleUpdateApprovalStatus(req);
        return res.status(post.status).json({
            message: post.message,
            status: post.status,
            data: post.data
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = JobPostingController;
//# sourceMappingURL=jobPostingController.js.map