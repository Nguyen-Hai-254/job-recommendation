import FollowServices from "../services/followServices";


export default class FollowController {
    static followCompany = async (req, res) => {
        try {
            if (!req.body.employerId) {
                return res.status(500).json({
                    message: 'Thiếu id của công ty',
                    status: 500,
                    error: 'Internal Server Error',
                });
            }

            const data = await FollowServices.handleFollowCompany(req.user, req.body.employerId);
            return res.status(data.status).json({
                status: data.status,
                message: data.message,
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

    static saveEmployee = async (req, res) => {
        try {
            if (!req.body.employeeId || !req.body.isOnlineProfile) {
                return res.status(500).json({
                    message: 'Thiếu thông tin người xin việc',
                    status: 500,
                    error: 'Internal Server Error',
                });
            }

            const data = await FollowServices.handleSaveEmployee(req.user, req.body.employeeId, req.body.isOnlineProfile);
            return res.status(data.status).json({
                status: data.status,
                message: data.message,
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

    static getFollowByEmployee = async (req, res) => {
        try {
            const data = await FollowServices.handleGetFollowByEmployee(req.user);
            return res.status(data.status).json({
                status: data.status,
                message: data.message,
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

    static getSaveEmployeeByEmployer = async (req, res) => {
        try {
            const data = await FollowServices.handleGetSaveEmployeeByEmployer(req.user);
            return res.status(data.status).json({
                status: data.status,
                message: data.message,
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

    static followJobPosting = async (req, res) => {
        try {
            if (!req.body.jobPosting) {
                return res.status(500).json({
                    message: 'Thiếu id của đăng tuyển',
                    status: 500,
                    error: 'Internal Server Error',
                });
            }
            const data = await FollowServices.handleFollowJobPosting(req.user, req.body.jobPosting)
            return res.status(data.status).json({
                status: data.status,
                message: data.message,
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

    static getFollowJobPosting = async (req, res) => {
        try {
            const data = await FollowServices.handleGetFollowJobPosting(req.user)
            return res.status(data.status).json({
                status: data.status,
                message: data.message,
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
}