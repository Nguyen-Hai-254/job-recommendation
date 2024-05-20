import { approvalStatus } from "../utils/enum";
import { HttpException } from "../exceptions/httpException";
import JobPostingServices from "../services/jobpostingServices";
import respondSuccess from "../utils/respondSuccess";

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

    static getLengthOfAllJobPostings = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetLengthOfAllJobPostings(req.query);
            return respondSuccess(res, 'get length of jobpostings successfully', jobPostings);
        } catch (error) {
            next(error);
        }
    }

    static getTotalResultsOfProfession = async (req, res, next) => {
        try {
            req.query.status = approvalStatus.approved;
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

    static getLengthOfAllJobPostingsByAdmin = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetLengthOfAllJobPostingsByAdmin(req.query);
            return respondSuccess(res, 'get length of jobpostings by admin successfully', jobPostings);
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
            return respondSuccess(res, 'Create job posting successfully', jobPosting, 201);
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
            return respondSuccess(res, `Job posting has postId: ${postId} are updated successfully`, jobPosting);
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
            return respondSuccess(res, `Job posting has postId: ${postId} are removed successfully`, jobPosting);
        } catch (error) {
            next(error);
        }
    }
}