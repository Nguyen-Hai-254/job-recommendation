import EmployeeServices from "../services/employeeServices";

export default class EmployeeController {
    static getAttachedDocument = async (req, res, next) => {
        try {
            const attached_document = await EmployeeServices.handleGetAttachedDocument(req);
            return res.status(attached_document.status).json({
                message: attached_document.message,
                status: attached_document.status,
                data: attached_document.data
            })
        } catch (error) {
            next(error);
        }
    }

    static createNewAttachedDocument = async (req, res, next) => {
        try {
            const attached_document = await EmployeeServices.handleCreateNewAttachedDocument(req);
            return res.status(attached_document.status).json({
                message: attached_document.message,
                status: attached_document.status,
                data: attached_document.data
            })
        } catch (error) {
            next(error);
        }
    }

    static updateAttachedDocument = async (req, res, next) => {
        try {
            const attached_document = await EmployeeServices.handleUpdateAttachedDocument(req);
            return res.status(attached_document.status).json({
                message: attached_document.message,
                status: attached_document.status,
                data: attached_document.data
            })
        } catch (error) {
            next(error);
        }
    }

    static deleteAttachedDocument = async (req, res, next) => {
        try {
            const attached_document = await EmployeeServices.handleDeleteAttachedDocument(req);
            return res.status(attached_document.status).json({
                message: attached_document.message,
                status: attached_document.status,
                data: attached_document.data
            })
        } catch (error) {
            next(error);
        }
    }

    static getOnlineProfile = async (req, res, next) => {
        try {
            const online_profile = await EmployeeServices.handleGetOnlineProfile(req);
            return res.status(online_profile.status).json({
                message: online_profile.message,
                status: online_profile.status,
                data: online_profile.data
            })
        } catch (error) {
            next(error);
        }
    }

    static createNewOnlineProfile = async (req, res, next) => {
        try {
            const online_profile = await EmployeeServices.handleCreateNewOnlineProfile(req);
            return res.status(online_profile.status).json({
                message: online_profile.message,
                status: online_profile.status,
                data: online_profile.data
            })
        } catch (error) {
            next(error);
        }
    }

    static updateOnlineProfile = async (req, res, next) => {
        try {
            const online_profile = await EmployeeServices.handleUpdateOnlineProfile(req);
            return res.status(online_profile.status).json({
                message: online_profile.message,
                status: online_profile.status,
                data: online_profile.data
            })
        } catch (error) {
            next(error);
        }
    }

    static deleteOnlineProfile = async (req, res, next) => {
        try {
            const online_profile = await EmployeeServices.handleDeleteOnlineProfile(req);
            return res.status(online_profile.status).json({
                message: online_profile.message,
                status: online_profile.status,
                data: online_profile.data
            })
        } catch (error) {
            next(error);
        }
    }

    // online profile : another degree, education information, work experience
    // 1. another degree
    static createNewAnotherDegree = async (req, res, next) => {
        try {
            const another_degrees = await EmployeeServices.handleCreateNewAnotherDegree(req);
            return res.status(another_degrees.status).json({
                message: another_degrees.message,
                status: another_degrees.status,
                data: another_degrees.data
            })
        } catch (error) {
            next(error);
        }
    }

    static updateAnotherDegree = async (req, res, next) => {
        try {
            const another_degree = await EmployeeServices.handleUpdateAnotherDegree(req);
            return res.status(another_degree.status).json({
                message: another_degree.message,
                status: another_degree.status,
                data: another_degree.data
            })
        } catch (error) {
            next(error);
        }
    }

    static deleteAnotherDegree = async (req, res, next) => {
        try {
            const another_degree = await EmployeeServices.handleDeleteAnotherDegree(req);
            return res.status(another_degree.status).json({
                message: another_degree.message,
                status: another_degree.status,
                data: another_degree.data
            })
        } catch (error) {
            next(error);
        }
    }

    // 2. education information
    static createNewEducationInformation = async (req, res, next) => {
        try {
            const education_informations = await EmployeeServices.handleCreateNewEducationInformation(req);
            return res.status(education_informations.status).json({
                message: education_informations.message,
                status: education_informations.status,
                data: education_informations.data
            })
        } catch (error) {
            next(error);
        }
    }

    static updateEducationInformation = async (req, res, next) => {
        try {
            const education_informations = await EmployeeServices.handleUpdateEducationInformation(req);
            return res.status(education_informations.status).json({
                message: education_informations.message,
                status: education_informations.status,
                data: education_informations.data
            })
        } catch (error) {
            next(error);
        }
    }

    static deleteEducationInformation = async (req, res, next) => {
        try {
            const education_informations = await EmployeeServices.handleDeleteEducationInformation(req);
            return res.status(education_informations.status).json({
                message: education_informations.message,
                status: education_informations.status,
                data: education_informations.data
            })
        } catch (error) {
            next(error);
        }
    }

    // 3. work experience
    static createNewWorkExperience = async (req, res, next) => {
        try {
            const workexperiences = await EmployeeServices.handleCreateNewWorkExperience(req);
            return res.status(workexperiences.status).json({
                message: workexperiences.message,
                status: workexperiences.status,
                data: workexperiences.data
            })
        } catch (error) {
            next(error);
        }
    }

    static updateWorkExperience = async (req, res, next) => {
        try {
            const workexperiences = await EmployeeServices.handleUpdateWorkExperience(req);
            return res.status(workexperiences.status).json({
                message: workexperiences.message,
                status: workexperiences.status,
                data: workexperiences.data
            })
        } catch (error) {
            next(error);
        }
    }

    static deleteWorkExperience = async (req, res, next) => {
        try {
            const workexperiences = await EmployeeServices.handleDeleteWorkExperience(req);
            return res.status(workexperiences.status).json({
                message: workexperiences.message,
                status: workexperiences.status,
                data: workexperiences.data
            })
        } catch (error) {
            next(error);
        }
    }

    static getEmployeesByAdmin = async (req, res, next) => {
        try {
            const employees = await EmployeeServices.handleGetEmployeesByAdmin(req);
            return res.status(employees.status).json({
                message: employees.message,
                status: employees.status,
                data: employees.data
            })
        } catch (error) {
            next(error);
        }
    }

    static getLengthOfEmployeesByAdmin = async (req, res, next) => {
        try {
            const employees = await EmployeeServices.handleGetLengthOfEmployeesByAdmin(req);
            return res.status(employees.status).json({
                message: employees.message,
                status: employees.status,
                data: employees.data
            })
        } catch (error) {
            next(error);
        }
    }

    static getEmployeesByEmployer = async (req, res, next) => {
        try {
            const employees = await EmployeeServices.handleGetEmployeesByEmployer(req);
            return res.status(employees.status).json({
                message: employees.message,
                status: employees.status,
                data: employees.data
            })
        } catch (error) {
            next(error);
        }
    }

    static getLengthOfEmployeesByEmployer = async (req, res, next) => {
        try {
            const employees = await EmployeeServices.handleGetLengthOfEmployeesByEmployer(req);
            return res.status(employees.status).json({
                message: employees.message,
                status: employees.status,
                data: employees.data
            })
        } catch (error) {
            next(error);
        }
    }

    static getEmployeesByEmployerSortByKeywords = async (req, res, next) => {
        try {
            const employees = await EmployeeServices.handleGetEmployeesByEmployerSortByKeywords(req);
            return res.status(employees.status).json({
                message: employees.message,
                status: employees.status,
                data: employees.data
            })
        } catch (error) {
            next(error);
        }
    }

}