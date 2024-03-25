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
}