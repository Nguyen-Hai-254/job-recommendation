import UserServices from "../services/userServices";


export default class UserController {
    static register = async (req, res) => {
        try {
            if (!req.body.email || !req.body.password || !req.body.confirmPassword) {
                return res.status(500).json({
                    message: "Missing input parameter!",
                    status: 500,
                    error: 'Internal Server Error',
                });
            }

            const { email, password, confirmPassword, role } = req.body;

            const data = await UserServices.handleRegister(email, password, confirmPassword, role)
            return res.status(data.status).json({
                status: data.status,
                message: data.message,
                // userData: data.data ? data.data : []
            });
        } catch (e) {
            return res.status(500).json({
                message: e.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static login = async (req, res) => {
        try {
            if (!req.body.email || !req.body.password) {
                return res.status(500).json({
                    message: "Missing input parameter!",
                    status: 500,
                    error: 'Internal Server Error',
                });
            }

            const userData = await UserServices.handleLogin(req.body.email, req.body.password);
            res.cookie("jwt", userData.data?.access_token, { httpOnly: true })

            return res.status(userData.status).json({
                status: userData.status,
                message: userData.message,
                data: userData.data ? userData.data : []
            });
        } catch (e) {
            return res.status(500).json({
                message: e.message,
                status: 500,
                error: 'Internal Server Error',
            });

        }
    }

    static logOut = async (req, res) => {
        try {
            res.clearCookie("jwt");
            return res.status(200).json({
                message: 'Logged out!',
                status: 200
            })
        } catch (e) {
            return res.status(500).json({
                message: e.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getProfile = async (req, res) => {
        try {
            const getUser = await UserServices.handleGetProfile(req.user);
            return res.status(getUser.status).json({
                message: getUser.message,
                status: 200,
                data: getUser.data ? getUser.data : []
            });
        } catch (e) {
            return res.status(500).json({
                message: e.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static editProfile = async (req, res) => {
        try {
            const editUser = await UserServices.handleEditProfile(req.user, req.body)
            return res.status(editUser.status).json({
                message: editUser.message,
                status: 200,
                data: editUser.data ? editUser.data : []
            });
        } catch (e) {
            return res.status(500).json({
                message: e.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }
}