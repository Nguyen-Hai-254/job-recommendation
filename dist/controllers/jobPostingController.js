"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("../utils/enum");
const httpException_1 = require("../exceptions/httpException");
const jobpostingServices_1 = __importDefault(require("../services/jobpostingServices"));
class JobPostingController {
}
_a = JobPostingController;
// Every User
JobPostingController.getJobPosting = async (req, res, next) => {
    try {
        const { postId } = req.params;
        if (!postId)
            throw new httpException_1.HttpException(400, 'postID is required');
        const jobPosting = await jobpostingServices_1.default.handleGetJobPosting(postId);
        return res.status(200).json({ message: 'get job posting successfully', data: jobPosting });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getAllJobPostings = async (req, res, next) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetAllJobPostings(req.query);
        return res.status(200).json({ message: 'get all job postings successfully', data: jobPostings });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getLengthOfAllJobPostings = async (req, res, next) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetLengthOfAllJobPostings(req.query);
        return res.status(200).json({ message: 'get length of jobpostings successfully', data: jobPostings });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getTotalResultsOfProfession = async (req, res, next) => {
    try {
        req.query.status = enum_1.approvalStatus.approved;
        const jobPostings = await jobpostingServices_1.default.handleGetTotalResultsOfProfession(req.query);
        return res.status(200).json({ message: 'get total results of professions successfully', data: jobPostings });
    }
    catch (error) {
        next(error);
    }
};
// Admin
JobPostingController.getAllJobPostingsByAdmin = async (req, res, next) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetAllJobPostingsByAdmin(req.query);
        return res.status(200).json({ message: 'get all job postings by admin successfully', data: jobPostings });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getLengthOfAllJobPostingsByAdmin = async (req, res, next) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetLengthOfAllJobPostingsByAdmin(req.query);
        return res.status(200).json({ message: 'get length of jobpostings by admin successfully', data: jobPostings });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.updateApprovalStatus = async (req, res, next) => {
    try {
        const { postId } = req.params;
        if (!postId)
            throw new httpException_1.HttpException(400, 'postID is required');
        if (!req.body)
            throw new httpException_1.HttpException(400, 'req body is required');
        const jobPosting = await jobpostingServices_1.default.handleUpdateApprovalStatus(postId, req.body);
        return res.status(200).json({ message: `Job posting has postId: ${postId} are updated successfully`, data: jobPosting });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getTotalResultsOfProfessionByAdmin = async (req, res, next) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetTotalResultsOfProfession(req.query);
        return res.status(200).json({ message: 'get total results of professions by admin successfully', data: jobPostings });
    }
    catch (error) {
        next(error);
    }
};
// Employer
JobPostingController.createNewJobPosting = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const jobPosting = await jobpostingServices_1.default.handleCreateNewJobPosting(userId, req);
        return res.status(201).json({ message: 'Create job posting successfully', data: jobPosting });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getJobPostingByEmployer = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { userId } = req.user;
        if (!postId)
            throw new httpException_1.HttpException(400, 'postID is required');
        const jobPosting = await jobpostingServices_1.default.handleGetJobPostingByEmployer(userId, postId);
        return res.status(200).json({ message: 'get job posting by employer successfully', data: jobPosting });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getJobPostingsByEmployer = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const jobPostings = await jobpostingServices_1.default.handleGetJobPostingsByEmployer(userId, req.query);
        return res.status(200).json({ message: 'get job postings by employer successfully', data: jobPostings });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.updateJobPosting = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { userId } = req.user;
        if (!postId)
            throw new httpException_1.HttpException(400, 'postID is required');
        if (!req.body)
            throw new httpException_1.HttpException(400, 'req body is required');
        const jobPosting = await jobpostingServices_1.default.handleUpdateJobPosting(userId, postId, req.body);
        return res.status(200).json({ message: `Job posting has postId: ${postId} are updated successfully`, data: jobPosting });
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.deleteJobPosting = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { postId } = req.params;
        if (!postId)
            throw new httpException_1.HttpException(400, 'postID is required');
        const jobPosting = await jobpostingServices_1.default.handleDeleteJobPosting(userId, postId);
        return res.status(200).json({ message: `Job posting has postId: ${postId} are removed successfully`, data: jobPosting });
    }
    catch (error) {
        next(error);
    }
};
exports.default = JobPostingController;
//# sourceMappingURL=jobPostingController.js.map