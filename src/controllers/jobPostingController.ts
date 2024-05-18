import JobPostingServices from "../services/jobpostingServices";

export default class JobPostingController {
    static getAllJobPostings = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetAllJobPostings(req);
            return res.status(jobPostings.status).json({
                message: jobPostings.message,
                status: jobPostings.status,
                data: jobPostings.data ? jobPostings.data : []
            });
        } catch (error) {
            next(error);
        }
    }

    static getLengthOfAllJobPostings = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetLengthOfAllJobPostings(req);
            return res.status(jobPostings.status).json({
                message: jobPostings.message,
                status: jobPostings.status,
                data: jobPostings.data ? jobPostings.data : []
            });
        } catch (error) {
            next(error);
        }
    }

    static getAllJobPostingsByAdmin = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetAllJobPostingsByAdmin(req);
            return res.status(jobPostings.status).json({
                message: jobPostings.message,
                status: jobPostings.status,
                data: jobPostings.data ? jobPostings.data : []
            });
        } catch (error) {
            next(error);
        }
    }

    static getLengthOfAllJobPostingsByAdmin = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetLengthOfAllJobPostingsByAdmin(req);
            return res.status(jobPostings.status).json({
                message: jobPostings.message,
                status: jobPostings.status,
                data: jobPostings.data ? jobPostings.data : []
            });
        } catch (error) {
            next(error);
        }
    }

    static getTotalResultsOfProfession = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetTotalResultsOfProfession();
            return res.status(jobPostings.status).json({
                message: jobPostings.message,
                status: jobPostings.status,
                data: jobPostings.data ? jobPostings.data : []
            });
        } catch (error) {
            next(error);
        }
    }

    static getTotalResultsOfProfessionByAdmin = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetTotalResultsOfProfessionByAdmin(req);
            return res.status(jobPostings.status).json({
                message: jobPostings.message,
                status: jobPostings.status,
                data: jobPostings.data ? jobPostings.data : []
            });
        } catch (error) {
            next(error);
        }
    }

    static getJobPostingsByEmployer = async (req, res, next) => {
        try {
            const jobPostings = await JobPostingServices.handleGetJobPostingsByEmployer(req);
            return res.status(jobPostings.status).json({
                message: jobPostings.message,
                status: 200,
                data: jobPostings.data ? jobPostings.data : []
            });
        } catch (error) {
            next(error);
        }
    }

    static getJobPosting = async (req, res, next) => {
        try {
            const jobPosting = await JobPostingServices.handleGetJobPosting(req);
            return res.status(jobPosting.status).json({
                message: jobPosting.message,
                status: jobPosting.status,
                data: jobPosting.data
            })
        } catch (error) {
            next(error);
        }
    }

    static getJobPostingByEmployer = async (req, res, next) => {
        try {
            const jobPosting = await JobPostingServices.handleGetJobPostingByEmployer(req);
            return res.status(jobPosting.status).json({
                message: jobPosting.message,
                status: jobPosting.status,
                data: jobPosting.data
            })
        } catch (error) {
            next(error);
        }
    }

    static deleteJobPosting = async (req, res, next) => {
        try {
            const jobPosting = await JobPostingServices.handleDeleteJobPosting(req);
            return res.status(jobPosting.status).json({
                message: jobPosting.message,
                status: jobPosting.status,
                data: jobPosting.data
            })
        } catch (error) {
            next(error);
        }
    }

    static updateJobPosting = async (req, res, next) => {
        try {
            const jobPosting = await JobPostingServices.handleUpdateJobPosting(req);
            return res.status(jobPosting.status).json({
                message: jobPosting.message,
                status: jobPosting.status,
                data: jobPosting.data
            })
        } catch (error) {
            next(error);
        }
    }

    static createNewJobPosting = async (req, res, next) => {
        try {
            const jobPosting = await JobPostingServices.handleCreateNewJobPosting(req);
            return res.status(jobPosting.status).json({
                message: jobPosting.message,
                status: jobPosting.status,
                data: jobPosting.data
            })
        } catch (error) {
            next(error);
        }
    }

    static updateApprovalStatus = async (req, res, next) => {
        try {
            const post = await JobPostingServices.handleUpdateApprovalStatus(req);
            return res.status(post.status).json({
                message: post.message,
                status: post.status,
                data: post.data
            })
        } catch (error) {
            next(error);
        }
    }
}