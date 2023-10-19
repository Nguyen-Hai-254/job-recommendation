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

    // online profile: another degree, education information, work experience
    static createNewAnotherDegree = async (req, res) => {
        try {
            const another_degrees = await EmployeeServices.handleCreateNewAnotherDegree(req);
            return res.status(another_degrees.status).json({
                message: another_degrees.message,
                status: another_degrees.status,
                data: another_degrees.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static createNewEducationInformation = async (req, res) => {
        try {
            const education_informations = await EmployeeServices.handleCreateNewEducationInformation(req);
            return res.status(education_informations.status).json({
                message: education_informations.message,
                status: education_informations.status,
                data: education_informations.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static createNewWorkExperience = async (req, res) => {
        try {
            const workexperiences = await EmployeeServices.handleCreateNewWorkExperience(req);
            return res.status(workexperiences.status).json({
                message: workexperiences.message,
                status: workexperiences.status,
                data: workexperiences.data
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