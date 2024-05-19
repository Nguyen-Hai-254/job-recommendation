import { HttpException } from "../exceptions/httpException";
import UserServices from "../services/userServices";


export default class UserController {
    static register = async (req, res, next) => {
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
        } catch (error) {
            next(error);
        }
    }

    static login = async (req, res, next) => {
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
        } catch (error) {
            next(error);
        }
    }

    static logOut = async (req, res, next) => {
        try {
            res.clearCookie("jwt");
            if (req.user) req.user = null;
            return res.status(200).json({
                message: 'Logged out!',
                status: 200
            })
        } catch (error) {
            next(error);
        }
    }

    static getProfile = async (req, res, next) => {
        try {
            const getUser = await UserServices.handleGetProfile(req.user);
            return res.status(getUser.status).json({
                message: getUser.message,
                status: getUser.status,
                data: getUser.data ? getUser.data : []
            });
        } catch (error) {
            next(error);
        }
    }

    static editProfile = async (req, res, next) => {
        try {
            const editUser = await UserServices.handleEditProfile(req.user, req.body)
            return res.status(editUser.status).json({
                message: editUser.message,
                status: editUser.status,
                data: editUser.data ? editUser.data : []
            });
        } catch (error) {
            next(error);
        }
    }

    static getInformationCompany = async (req, res, next) => {
        try {
            const getCompany = await UserServices.handleGetInformationCompany(req.user);
            return res.status(getCompany.status).json({
                message: getCompany.message,
                status: getCompany.status,
                data: getCompany.data ? getCompany.data : []
            });
        } catch (error) {
            next(error);
        }
    }

    static editInformationCompany = async (req, res, next) => {
        try {
            const editCompany = await UserServices.handleEditInformationCompany(req.user, req.body);
            return res.status(editCompany.status).json({
                message: editCompany.message,
                status: editCompany.status,
                data: editCompany.data ? editCompany.data : []
            });
        } catch (error) {
            next(error);
        }
    }

    static uploadAvatar = async (req, res, next) => {
        try {
            if (!req.body.avatar) {
                return res.status(500).json({
                    message: "Missing input parameter!",
                    status: 500,
                    error: 'Internal Server Error',
                });
            }
            const avatar = await UserServices.handleUploadAvatar(req.user, req.body.avatar);
            return res.status(avatar.status).json(avatar);
        } catch (error) {
            next(error);
        }
    }

    static uploadLogo = async (req, res, next) => {
        try {
            if (!req.body.logo) {
                return res.status(500).json({
                    message: "Missing input parameter!",
                    status: 500,
                    error: 'Internal Server Error',
                });
            }
            const logo = await UserServices.handleUploadLogo(req.user, req.body.logo);
            return res.status(logo.status).json(logo);
        } catch (error) {
            next(error);
        }
    }

    static uploadBanner = async (req, res, next) => {
        try {
            if (!req.body.banner) {
                return res.status(500).json({
                    message: "Missing input parameter!",
                    status: 500,
                    error: 'Internal Server Error',
                });
            }
            const banner = await UserServices.handleUploadBanner(req.user, req.body.banner);
            return res.status(banner.status).json(banner);
        } catch (error) {
            next(error);
        }
    }

    static getInformationCompanyByUser = async (req, res, next) => {
        try {
            if (!req.query.employerId) {
                return res.status(500).json({
                    message: "Missing input parameter!",
                    status: 500,
                    error: 'Internal Server Error',
                });
            }
            const company = await UserServices.handleGetInformationCompanyByUser(req.query.employerId);
            return res.status(company.status).json(company);
        } catch (error) {
            next(error);
        }
    }

    static getAllCompanyByUser = async (req, res, next) => {
        try {
            if (!req.query.num || !req.query.page) {
                return res.status(500).json({
                    message: "Missing input parameter!",
                    status: 500,
                    error: 'Internal Server Error',
                });
            }

            const companyList = await UserServices.handleGetAllCompanyByUser(req.query.num, req.query.page);
            return res.status(companyList.status).json(companyList);
        } catch (error) {
            next(error);
        }
    }

    static deleteUser = async (req, res, next) => {
        try {
            const user = await UserServices.handleDeleteUser(req);
            return res.status(user.status).json({
                message: user.message,
                status: user.status,
                data: user.data
            });
        } catch (error) {
            next(error);
        }
    }

    static getOnlineProfileByUser = async (req, res, next) => {
        try {
            if (!req.query.userId) {
                return res.status(500).json({
                    message: "Missing input parameter!",
                    status: 500,
                    error: 'Internal Server Error',
                });
            }
            const user = await UserServices.handleGetOnlineProfileByUser(req.query.userId);
            return res.status(user.status).json({
                message: user.message,
                status: user.status,
                data: user.data
            });
        } catch (error) {
            next(error);
        }
    }

    static getAttachedDocumentByUser = async (req, res, next) => {
        try {
            if (!req.query.userId) {
                return res.status(500).json({
                    message: "Missing input parameter!",
                    status: 500,
                    error: 'Internal Server Error',
                });
            }
            const user = await UserServices.handleGetAttachedDocumentByUser(req.query.userId);
            return res.status(user.status).json({
                message: user.message,
                status: user.status,
                data: user.data
            });
        } catch (error) {
            next(error);
        }
    }
}