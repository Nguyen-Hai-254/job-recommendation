import JobpostingServices from "../services/jobpostingServices";


export default class JobpostingController {
    static getAllJobpostings = async (req, res) => {
        try {
            const jobpostings = await JobpostingServices.handleGetAllJobpostings();
            return res.status(jobpostings.status).json({
                message: jobpostings.message,
                status: jobpostings.status,
                data: jobpostings.data ? jobpostings.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }
    static getJobpostingsbyUser = async (req, res) => {
        try {
            const jobpostings = await JobpostingServices.handleGetJobpostingsbyUser(req);
            return res.status(jobpostings.status).json({
                message: jobpostings.message,
                status: 200,
                data: jobpostings.data ? jobpostings.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }
    static getJobposting = async (req, res) => {
        try {
            const jobposting = await JobpostingServices.handleGetJobposting(req);
            return res.status(jobposting.status).json({
                message: jobposting.message,
                status: jobposting.status,
                data: jobposting.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }
    static updateJobposting = async (req, res) => {
        try {
            const jobposting = await JobpostingServices.handleUpdateJobPosting(req);
            return res.status(jobposting.status).json({
                message: jobposting.message,
                status: jobposting.status,
                data: jobposting.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }
    static createNewJobposting = async (req, res) => {
        try {
            const jobposting = await JobpostingServices.handleCreateNewJobposting(req);
            return res.status(jobposting.status).json({
                message: jobposting.message,
                status: jobposting.status,
                data: jobposting.data
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