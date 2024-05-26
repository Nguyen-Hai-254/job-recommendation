"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("../utils/enum");
const httpException_1 = require("../exceptions/httpException");
const jobpostingServices_1 = __importDefault(require("../services/jobpostingServices"));
const respondSuccess_1 = __importDefault(require("../utils/respondSuccess"));
const notificationQueue = require('../queues/notification.queue');
const connectDB_1 = require("../config/connectDB");
const entities_1 = require("../entities");
const notificationRepository = connectDB_1.myDataSource.getRepository(entities_1.Notification);
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
        return (0, respondSuccess_1.default)(res, 'get job posting successfully', jobPosting);
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getAllJobPostings = async (req, res, next) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetAllJobPostings(req.query);
        return (0, respondSuccess_1.default)(res, 'get all job postings successfully', jobPostings);
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getTotalResultsOfProfession = async (req, res, next) => {
    try {
        req.query.status = enum_1.approvalStatus.approved;
        const jobPostings = await jobpostingServices_1.default.handleGetTotalResultsOfProfession(req.query);
        return (0, respondSuccess_1.default)(res, 'get total results of professions successfully', jobPostings);
    }
    catch (error) {
        next(error);
    }
};
// Admin
JobPostingController.getAllJobPostingsByAdmin = async (req, res, next) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetAllJobPostingsByAdmin(req.query);
        return (0, respondSuccess_1.default)(res, 'get all job postings by admin successfully', jobPostings);
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.UpdateJobPostingByAdmin = async (req, res, next) => {
    try {
        const { postId } = req.params;
        if (!postId)
            throw new httpException_1.HttpException(400, 'postID is required');
        if (!req.body)
            throw new httpException_1.HttpException(400, 'req body is required');
        const jobPosting = await jobpostingServices_1.default.handleUpdateJobPostingByAdmin(postId, req.body);
        return (0, respondSuccess_1.default)(res, `Job posting has postId: ${postId} are updated successfully`, jobPosting);
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getTotalResultsOfProfessionByAdmin = async (req, res, next) => {
    try {
        const jobPostings = await jobpostingServices_1.default.handleGetTotalResultsOfProfession(req.query);
        return (0, respondSuccess_1.default)(res, 'get total results of professions by admin successfully', jobPostings);
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
        const message = `Bạn đã tạo tin tuyển dụng ${jobPosting.jobTitle} thành công`;
        const notification = notificationRepository.create({
            user: req.user,
            title: 'job posting',
            content: message
        });
        await notificationQueue.add(notification);
        return (0, respondSuccess_1.default)(res, message, jobPosting, 201);
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
        return (0, respondSuccess_1.default)(res, 'get job posting by employer successfully', jobPosting);
    }
    catch (error) {
        next(error);
    }
};
JobPostingController.getJobPostingsByEmployer = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const jobPostings = await jobpostingServices_1.default.handleGetJobPostingsByEmployer(userId, req.query);
        return (0, respondSuccess_1.default)(res, 'get job postings by employer successfully', jobPostings);
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
        const message = `Bạn đã cập nhật tin tuyển dụng ${jobPosting.jobTitle} (postId:${postId})`;
        const notification = notificationRepository.create({
            user: req.user,
            title: 'job posting',
            content: message
        });
        await notificationQueue.add(notification);
        return (0, respondSuccess_1.default)(res, message, jobPosting);
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
        return (0, respondSuccess_1.default)(res, `Job posting has postId: ${postId} are removed successfully`, jobPosting);
    }
    catch (error) {
        next(error);
    }
};
exports.default = JobPostingController;
//# sourceMappingURL=jobPostingController.js.map