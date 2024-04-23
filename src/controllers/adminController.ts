import AdminServices from "../services/adminServices";


export default class AdminController {
    static jobPostingsReport = async (req, res) => {
        try {
            const jobPostings = await AdminServices.handleGetJobPostingsReport();
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

    static candidateStatistics = async (req, res) => {
        try {
            const data = await AdminServices.handleCandidateStatistics();
            return res.status(data.status).json({
                message: data.message,
                status: data.status,
                data: data.data ? data.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getAllUser = async (req, res) => {
        try {
            const allUser = await AdminServices.handleGetAllUser(req);
            return res.status(allUser.status).json({
                message: allUser.message,
                status: allUser.status,
                data: allUser.data ? allUser.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getTotalUser = async (req, res) => {
        try {
            const totalUser = await AdminServices.handleGetTotalUser(req);
            return res.status(totalUser.status).json({
                message: totalUser.message,
                status: totalUser.status,
                data: totalUser.data ? totalUser.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static sendEmail = async (req, res) => {
        try {
            if (!req.body.emails || !req.body.subject || !req.body.html) {
                return res.status(500).json({
                    message: "Missing input parameter!",
                    status: 500,
                    error: 'Internal Server Error',
                });
            }

            const result = await AdminServices.handleSendEmail(req.body.emails, req.body.subject, req.body.html);
            return res.status(result.status).json({
                message: result.message,
                status: result.status,
                data: result.data ? result.data : []
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }
}