import { approvalStatus } from "../utils/enum";
import { HttpException } from "../exceptions/httpException";
import JobPostingServices from "../services/jobpostingServices";
import respondSuccess from "../utils/respondSuccess";
const notificationQueue = require('../workers/queues/notification.queue');

import { myDataSource } from "../config/connectDB"
import { Notification } from "../entities"
const notificationRepository = myDataSource.getRepository(Notification);

export default class JobPostingController {
    // Every User
    static getJobPosting = async (req, res, next) => {
        try {
            const { postId } = req.params;
            if (!postId) throw new HttpException(400, 'postID is required');
            const jobPosting = await JobPostingServices.handleGetJobPosting(postId);
            return respondSuccess(res, 'get job posting successfully', jobPosting);
        } catch (error) {
            next(error);
        }
    }

    static getAllJobPostings = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetAllJobPostings(req.query);
            return respondSuccess(res, 'get all job postings successfully', jobPostings);
        } catch (error) {
            next(error);
        }
    }

    static getTotalResultsOfProfession = async (req, res, next) => {
        try {
            req.query.status = approvalStatus.approved;
            req.query.isHidden = false;
            const jobPostings = await JobPostingServices.handleGetTotalResultsOfProfession(req.query);
            return respondSuccess(res, 'get total results of professions successfully', jobPostings);
        } catch (error) {
            next(error);
        }
    }

    // Admin
    static getAllJobPostingsByAdmin = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetAllJobPostingsByAdmin(req.query);
            return respondSuccess(res, 'get all job postings by admin successfully', jobPostings);
        } catch (error) {
            next(error);
        }
    }

    static UpdateJobPostingByAdmin = async (req, res, next) => {
        try {
            const { postId } = req.params;
            if (!postId) throw new HttpException(400, 'postID is required');
            if (!req.body) throw new HttpException(400, 'req body is required');

            const jobPosting = await JobPostingServices.handleUpdateJobPostingByAdmin(postId, req.body);
            
            if (req.body.status) {
                // TODO: send notification to employer
                const notificationToEmployer = notificationRepository.create({
                    user: { userId: jobPosting.employer.userId },
                    title: 'job posting', 
                    content: `Tin tuyển dụng của bạn ${jobPosting.jobTitle} đã được admin cập nhật thành ${jobPosting.status}`
                })
                await notificationQueue.add(notificationToEmployer)
            }

            return respondSuccess(res, `Job posting has postId: ${postId} are updated successfully`, jobPosting);
        } catch (error) {
            next(error);
        }
    }

    static getTotalResultsOfProfessionByAdmin = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetTotalResultsOfProfession(req.query);
            return respondSuccess(res, 'get total results of professions by admin successfully', jobPostings);
        } catch (error) {
            next(error);
        }
    }

    // Employer
    static createNewJobPosting = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const jobPosting = await JobPostingServices.handleCreateNewJobPosting(userId, req);
            const message = `Bạn đã tạo tin tuyển dụng ${jobPosting.jobTitle} thành công`;

            const notification = notificationRepository.create({
                user: req.user,
                title: 'job posting', 
                content: message
            })
            await notificationQueue.add(notification)

            return respondSuccess(res, message, jobPosting, 201);
        } catch (error) {
            next(error);
        }
    }

    static getJobPostingByEmployer = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { userId } = req.user;
            if ( !postId ) throw new HttpException(400, 'postID is required');

            const jobPosting = await JobPostingServices.handleGetJobPostingByEmployer( userId , postId );
            return respondSuccess(res, 'get job posting by employer successfully', jobPosting);
        } catch (error) {
            next(error);
        }
    }

    static getJobPostingsByEmployer = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const jobPostings = await JobPostingServices.handleGetJobPostingsByEmployer(userId, req.query);
            return respondSuccess(res, 'get job postings by employer successfully', jobPostings);
        } catch (error) {
            next(error);
        }
    }

    static updateJobPosting = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { userId } = req.user;
            if (!postId) throw new HttpException(400, 'postID is required');
            if (!req.body) throw new HttpException(400, 'req body is required');

            const jobPosting = await JobPostingServices.handleUpdateJobPosting( userId, postId, req.body);
            const message = `Bạn đã cập nhật tin tuyển dụng ${jobPosting.jobTitle} (postId:${postId})`;

            const notification = notificationRepository.create({
                user: req.user,
                title: 'job posting', 
                content: message
            })
            await notificationQueue.add(notification)

            return respondSuccess(res, message, jobPosting);
        } catch (error) {
            next(error);
        }
    }

    static deleteJobPosting = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { postId } = req.params;
            if (!postId) throw new HttpException(400, 'postID is required');
            const jobPosting = await JobPostingServices.handleDeleteJobPosting(userId, postId);
            return respondSuccess(res, `Job posting has postId: ${postId} are removed successfully`, jobPosting);
        } catch (error) {
            next(error);
        }
    }
}