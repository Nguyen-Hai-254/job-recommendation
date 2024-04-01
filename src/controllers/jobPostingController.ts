import JobPostingServices from "../services/jobpostingServices";

export default class JobPostingController {
    static getAllJobPostings = async (req, res) => {
        try {
            const jobPostings = await JobPostingServices.handleGetAllJobPostings(req);
            return res.status(jobPostings.status).json({
                message: jobPostings.message,
                status: jobPostings.status,
                data: jobPostings.data ? jobPostings.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getLengthOfAllJobPostings = async (req, res) => {
        try {
            const jobPostings = await JobPostingServices.handleGetLengthOfAllJobPostings(req);
            return res.status(jobPostings.status).json({
                message: jobPostings.message,
                status: jobPostings.status,
                data: jobPostings.data ? jobPostings.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getAllJobPostingsByAdmin = async (req, res) => {
        try {
            const jobPostings = await JobPostingServices.handleGetAllJobPostingsByAdmin(req);
            return res.status(jobPostings.status).json({
                message: jobPostings.message,
                status: jobPostings.status,
                data: jobPostings.data ? jobPostings.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getLengthOfAllJobPostingsByAdmin = async (req, res) => {
        try {
            const jobPostings = await JobPostingServices.handleGetLengthOfAllJobPostingsByAdmin(req);
            return res.status(jobPostings.status).json({
                message: jobPostings.message,
                status: jobPostings.status,
                data: jobPostings.data ? jobPostings.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getTotalResultsOfProfession = async (req, res) => {
        try {
            const jobPostings = await JobPostingServices.handleGetTotalResultsOfProfession();
            return res.status(jobPostings.status).json({
                message: jobPostings.message,
                status: jobPostings.status,
                data: jobPostings.data ? jobPostings.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getJobPostingsByEmployer = async (req, res) => {
        try {
            const jobPostings = await JobPostingServices.handleGetJobPostingsByEmployer(req);
            return res.status(jobPostings.status).json({
                message: jobPostings.message,
                status: 200,
                data: jobPostings.data ? jobPostings.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getJobPosting = async (req, res) => {
        try {
            const jobPosting = await JobPostingServices.handleGetJobPosting(req);
            return res.status(jobPosting.status).json({
                message: jobPosting.message,
                status: jobPosting.status,
                data: jobPosting.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getJobPostingByEmployer = async (req, res) => {
        try {
            const jobPosting = await JobPostingServices.handleGetJobPostingByEmployer(req);
            return res.status(jobPosting.status).json({
                message: jobPosting.message,
                status: jobPosting.status,
                data: jobPosting.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static updateJobPosting = async (req, res) => {
        try {
            const jobPosting = await JobPostingServices.handleUpdateJobPosting(req);
            return res.status(jobPosting.status).json({
                message: jobPosting.message,
                status: jobPosting.status,
                data: jobPosting.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static createNewJobPosting = async (req, res) => {
        try {
            const jobPosting = await JobPostingServices.handleCreateNewJobPosting(req);
            return res.status(jobPosting.status).json({
                message: jobPosting.message,
                status: jobPosting.status,
                data: jobPosting.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static updateApprovalStatus = async (req, res) => {
        try {
            const post = await JobPostingServices.handleUpdateApprovalStatus(req);
            return res.status(post.status).json({
                message: post.message,
                status: post.status,
                data: post.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }
}