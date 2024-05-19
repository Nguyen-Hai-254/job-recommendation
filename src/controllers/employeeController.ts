import { HttpException } from "../exceptions/httpException";
import EmployeeServices from "../services/employeeServices";

export default class EmployeeController {
    static getAttachedDocument = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const attached_document = await EmployeeServices.handleGetAttachedDocument(userId);
            return res.status(200).json({message: 'get my attached document successfully', data: attached_document})
        } catch (error) {
            next(error);
        }
    }

    static createNewAttachedDocument = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!req.body) throw new HttpException(400, 'Invalid body')
            const attached_document = await EmployeeServices.handleCreateNewAttachedDocument(userId, req.body);
            return res.status(201).json({message: 'Create my new attached document successfully', data: attached_document})
        } catch (error) {
            next(error);
        }
    }

    static updateAttachedDocument = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!req.body) throw new HttpException(400, 'Invalid body')
            const attached_document = await EmployeeServices.handleUpdateAttachedDocument(userId, req.body);
            return res.status(200).json({message: 'update my attached document successfully', data: attached_document})
        } catch (error) {
            next(error);
        }
    }

    // Admin
    static deleteAttachedDocument = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'id is required');
            const attached_document = await EmployeeServices.handleDeleteAttachedDocument(id);
            return res.status(200).json({message: 'remove attached document successfully', data: attached_document})
        } catch (error) {
            next(error);
        }
    }

    static getOnlineProfile = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const online_profile = await EmployeeServices.handleGetOnlineProfile(userId);
            return res.status(200).json({message: 'get my online profile successfully', data: online_profile})
        } catch (error) {
            next(error);
        }
    }

    static createNewOnlineProfile = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const online_profile = await EmployeeServices.handleCreateNewOnlineProfile(userId, req.body);
            return res.status(201).json({message: 'Create my new online profile successfully', data: online_profile });
        } catch (error) {
            next(error);
        }
    }

    static updateOnlineProfile = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const online_profile = await EmployeeServices.handleUpdateOnlineProfile(userId, req.body);
            return res.status(200).json({message: 'Update my online profile successfully', data: online_profile });
        } catch (error) {
            next(error);
        }
    }

    // admin
    static deleteOnlineProfile = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'id is required');
            const online_profile = await EmployeeServices.handleDeleteOnlineProfile(id);
            return res.status(200).json({message: 'remove online profile successfully', data: online_profile})
        } catch (error) {
            next(error);
        }
    }

    // online profile : another degree, education information, work experience
    // 1. another degree
    static createNewAnotherDegree = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const another_degree = await EmployeeServices.handleCreateNewAnotherDegree(userId, req.body);
            return res.status(201).json({message: 'Create new another degree successfully', data: another_degree})
        } catch (error) {
            next(error);
        }
    }

    static updateAnotherDegree = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'Invalid id');
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const another_degree = await EmployeeServices.handleUpdateAnotherDegree(userId, id, req.body);
            return res.status(200).json({message: 'Updated degree successfully', data: another_degree });
        } catch (error) {
            next(error);
        }
    }

    static deleteAnotherDegree = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'Invalid id');
            const another_degree = await EmployeeServices.handleDeleteAnotherDegree(userId, id);
            return res.status(200).json({message: 'Delete degree successfully', data: another_degree });
        } catch (error) {
            next(error);
        }
    }

    // 2. education information
    static createNewEducationInformation = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const education_information = await EmployeeServices.handleCreateNewEducationInformation(userId, req.body);
            return res.status(201).json({message: 'Create new education information successfully', data: education_information})
        } catch (error) {
            next(error);
        }
    }

    static updateEducationInformation = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'Invalid id');
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const education_information = await EmployeeServices.handleUpdateEducationInformation(userId, id, req.body);
            return res.status(200).json({message: 'Update education information successfully', data: education_information})
        } catch (error) {
            next(error);
        }
    }

    static deleteEducationInformation = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'Invalid id');
            const education_informations = await EmployeeServices.handleDeleteEducationInformation(userId, id);
            return res.status(200).json({message: 'Delete education information successfully', data: education_informations });
        } catch (error) {
            next(error);
        }
    }

    // 3. work experience
    static createNewWorkExperience = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const work_experience = await EmployeeServices.handleCreateNewWorkExperience(userId, req.body);
            return res.status(201).json({message: 'Create new work experience successfully', data: work_experience})
        } catch (error) {
            next(error);
        }
    }

    static updateWorkExperience = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'Invalid id');
            if (!req.body) throw new HttpException(400, 'Invalid body');
            const workexperience = await EmployeeServices.handleUpdateWorkExperience(userId, id, req.body);
            return res.status(200).json({message: 'Update education information successfully', data: workexperience})
        } catch (error) {
            next(error);
        }
    }

    static deleteWorkExperience = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { id } = req.params;
            if (!id) throw new HttpException(400, 'Invalid id');
            const work_experience = await EmployeeServices.handleDeleteWorkExperience(userId, id);
            return res.status(200).json({message: 'Delete work experience successfully', data: work_experience });
        } catch (error) {
            next(error);
        }
    }

    static getEmployeesByAdmin = async (req, res, next) => {
        try {
            const employees = await EmployeeServices.handleGetEmployeesByAdmin(req.query);
            return res.status(200).json({message: 'get employees by admin successfully', data: employees});
        } catch (error) {
            next(error);
        }
    }

    static getLengthOfEmployeesByAdmin = async (req, res, next) => {
        try {
            const employees = await EmployeeServices.handleGetLengthOfEmployeesByAdmin(req.query);
            return res.status(200).json({message: 'get length of employees by admin successfully', data: employees});
        } catch (error) {
            next(error);
        }
    }

    static getEmployeesByEmployer = async (req, res, next) => {
        try {
            const employees = await EmployeeServices.handleGetEmployeesByEmployer(req.query);
            return res.status(200).json({message: 'get employees by employer successfully', data: employees});
        } catch (error) {
            next(error);
        }
    }

    static getLengthOfEmployeesByEmployer = async (req, res, next) => {
        try {
            const employees = await EmployeeServices.handleGetLengthOfEmployeesByEmployer(req.query);
            return res.status(200).json({message: 'get length of employees by employer successfully', data: employees});
        } catch (error) {
            next(error);
        }
    }

    static getEmployeesByEmployerSortByKeywords = async (req, res, next) => {
        try {
            const { keywords, num, page } = req.query;
            if (!keywords) throw new HttpException(400, 'Invalid keywords');
            if (!page) req.query.page = 1;
            if (!num) req.query.num = 10;

            const employees = await EmployeeServices.handleGetEmployeesByEmployerSortByKeywords(req.query);
            return res.status(200).json({
                message: 'get employees by employer sort by keywords successfully',
                data: employees
            })
        } catch (error) {
            next(error);
        }
    }

}