import EmployeeServices from "../services/employeeServices";

export default class EmployeeController {
    static createNewAttachedDocument = async (req, res) => {
        try {
            const attached_document = await EmployeeServices.handleCreateNewAttachedDocument(req);
            return res.status(attached_document.status).json({
                message: attached_document.message,
                status: attached_document.status,
                data: attached_document.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static createNewOnlineProfile = async (req, res) => {
        try {
            const online_profile = await EmployeeServices.handleCreateNewOnlineProfile(req);
            return res.status(online_profile.status).json({
                message: online_profile.message,
                status: online_profile.status,
                data: online_profile.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static updateAttachedDocument = async (req, res) => {
        try {
            const attached_document = await EmployeeServices.handleUpdateAttachedDocument(req);
            return res.status(attached_document.status).json({
                message: attached_document.message,
                status: attached_document.status,
                data: attached_document.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static updateOnlineProfile = async (req, res) => {
        try {
            const online_profile = await EmployeeServices.handleUpdateOnlineProfile(req);
            return res.status(online_profile.status).json({
                message: online_profile.message,
                status: online_profile.status,
                data: online_profile.data
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