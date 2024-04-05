import EmployeeServices from "../services/employeeServices";

export default class EmployeeController {
    static getAttachedDocument = async (req, res) => {
        try {
            const attached_document = await EmployeeServices.handleGetAttachedDocument(req);
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
                message: err,
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

    static getOnlineProfile = async (req, res) => {
        try {
            const online_profile = await EmployeeServices.handleGetOnlineProfile(req);
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

    // online profile : another degree, education information, work experience
    // 1. another degree
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

    static updateAnotherDegree = async (req, res) => {
        try {
            const another_degree = await EmployeeServices.handleUpdateAnotherDegree(req);
            return res.status(another_degree.status).json({
                message: another_degree.message,
                status: another_degree.status,
                data: another_degree.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static deleteAnotherDegree = async (req, res) => {
        try {
            const another_degree = await EmployeeServices.handleDeleteAnotherDegree(req);
            return res.status(another_degree.status).json({
                message: another_degree.message,
                status: another_degree.status,
                data: another_degree.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    // 2. education information
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

    static updateEducationInformation = async (req, res) => {
        try {
            const education_informations = await EmployeeServices.handleUpdateEducationInformation(req);
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

    static deleteEducationInformation = async (req, res) => {
        try {
            const education_informations = await EmployeeServices.handleDeleteEducationInformation(req);
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

    // 3. work experience
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

    static updateWorkExperience = async (req, res) => {
        try {
            const workexperiences = await EmployeeServices.handleUpdateWorkExperience(req);
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

    static deleteWorkExperience = async (req, res) => {
        try {
            const workexperiences = await EmployeeServices.handleDeleteWorkExperience(req);
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

    static getEmployeesByAdmin = async (req, res) => {
        try {
            const employees = await EmployeeServices.handleGetEmployeesByAdmin(req);
            return res.status(employees.status).json({
                message: employees.message,
                status: employees.status,
                data: employees.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getLengthOfEmployeesByAdmin = async (req, res) => {
        try {
            const employees = await EmployeeServices.handleGetLengthOfEmployeesByAdmin(req);
            return res.status(employees.status).json({
                message: employees.message,
                status: employees.status,
                data: employees.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getEmployeesByEmployer = async (req, res) => {
        try {
            const employees = await EmployeeServices.handleGetEmployeesByEmployer(req);
            return res.status(employees.status).json({
                message: employees.message,
                status: employees.status,
                data: employees.data
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500,
                error: 'Internal Server Error',
            });
        }
    }

    static getLengthOfEmployeesByEmployer = async (req, res) => {
        try {
            const employees = await EmployeeServices.handleGetLengthOfEmployeesByEmployer(req);
            return res.status(employees.status).json({
                message: employees.message,
                status: employees.status,
                data: employees.data
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