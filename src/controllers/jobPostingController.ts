import { approvalStatus } from "../utils/enum";
import { HttpException } from "../exceptions/httpException";
import JobPostingServices from "../services/jobpostingServices";

export default class JobPostingController {
    // Every User
    static getJobPosting = async (req, res, next) => {
        try {
            const { postId } = req.params;
            if (!postId) throw new HttpException(400, 'postID is required');
            const jobPosting = await JobPostingServices.handleGetJobPosting(postId);
            return res.status(200).json({ message: 'get job posting successfully', data: jobPosting});
        } catch (error) {
            next(error);
        }
    }

    static getAllJobPostings = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetAllJobPostings(req.query);
            return res.status(200).json({ message: 'get all job postings successfully', data: jobPostings});
        } catch (error) {
            next(error);
        }
    }

    static getLengthOfAllJobPostings = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetLengthOfAllJobPostings(req.query);
            return res.status(200).json({message: 'get length of jobpostings successfully', data: jobPostings });
        } catch (error) {
            next(error);
        }
    }

    static getTotalResultsOfProfession = async (req, res, next) => {
        try {
            req.query.status = approvalStatus.approved;
            const jobPostings = await JobPostingServices.handleGetTotalResultsOfProfession(req.query);
            return res.status(200).json({message: 'get total results of professions successfully', data: jobPostings });
        } catch (error) {
            next(error);
        }
    }

    // Admin
    static getAllJobPostingsByAdmin = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetAllJobPostingsByAdmin(req.query);
            return res.status(200).json({ message: 'get all job postings by admin successfully', data: jobPostings});
        } catch (error) {
            next(error);
        }
    }

    static getLengthOfAllJobPostingsByAdmin = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetLengthOfAllJobPostingsByAdmin(req.query);
            return res.status(200).json({message: 'get length of jobpostings by admin successfully', data: jobPostings });
        } catch (error) {
            next(error);
        }
    }

    static updateApprovalStatus = async (req, res, next) => {
        try {
            const { postId } = req.params;
            if (!postId) throw new HttpException(400, 'postID is required');
            if (!req.body) throw new HttpException(400, 'req body is required');

            const jobPosting = await JobPostingServices.handleUpdateApprovalStatus(postId, req.body);
            return res.status(200).json({ message: `Job posting has postId: ${postId} are updated successfully`, data: jobPosting});
        } catch (error) {
            next(error);
        }
    }

    static getTotalResultsOfProfessionByAdmin = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetTotalResultsOfProfession(req.query);
            return res.status(200).json({message: 'get total results of professions by admin successfully', data: jobPostings });
        } catch (error) {
            next(error);
        }
    }

    // Employer
    static createNewJobPosting = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const jobPosting = await JobPostingServices.handleCreateNewJobPosting(userId, req);
            return res.status(201).json({ message: 'Create job posting successfully', data: jobPosting});
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
            return res.status(200).json({ message: 'get job posting by employer successfully', data: jobPosting});
        } catch (error) {
            next(error);
        }
    }

    static getJobPostingsByEmployer = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const jobPostings = await JobPostingServices.handleGetJobPostingsByEmployer(userId, req.query);
            return res.status(200).json({ message: 'get job postings by employer successfully', data: jobPostings});
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
            return res.status(200).json({ message: `Job posting has postId: ${postId} are updated successfully`, data: jobPosting});
        } catch (error) {
            next(error);
        }
    }

    static deleteJobPosting = async (req, res, next) => {
        try {
            const { userId} = req.user;
            const { postId } = req.params;
            if (!postId) throw new HttpException(400, 'postID is required');
            const jobPosting = await JobPostingServices.handleDeleteJobPosting(userId, postId);
            return res.status(200).json({ message: `Job posting has postId: ${postId} are removed successfully`, data: jobPosting});
        } catch (error) {
            next(error);
        }
    }
}