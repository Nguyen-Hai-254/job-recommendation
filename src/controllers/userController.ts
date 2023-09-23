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

            const data = await UserServices.handleRegister(req.body.email, req.body.password, req.body.confirmPassword)
            return res.status(data.status).json({
                status: data.status,
                message: data.message,
                data: data.data ? data.data : []
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
}