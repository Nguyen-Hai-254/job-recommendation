"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const httpException_1 = require("../exceptions/httpException");
const employeeServices_1 = __importDefault(require("../services/employeeServices"));
class EmployeeController {
}
_a = EmployeeController;
EmployeeController.getAttachedDocument = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const attached_document = await employeeServices_1.default.handleGetAttachedDocument(userId);
        return res.status(200).json({ message: 'get my attached document successfully', data: attached_document });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.createNewAttachedDocument = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const attached_document = await employeeServices_1.default.handleCreateNewAttachedDocument(userId, req.body);
        return res.status(201).json({ message: 'Create my new attached document successfully', data: attached_document });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.updateAttachedDocument = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const attached_document = await employeeServices_1.default.handleUpdateAttachedDocument(userId, req.body);
        return res.status(200).json({ message: 'update my attached document successfully', data: attached_document });
    }
    catch (error) {
        next(error);
    }
};
// Admin
EmployeeController.deleteAttachedDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'id is required');
        const attached_document = await employeeServices_1.default.handleDeleteAttachedDocument(id);
        return res.status(200).json({ message: 'remove attached document successfully', data: attached_document });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.getOnlineProfile = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const online_profile = await employeeServices_1.default.handleGetOnlineProfile(userId);
        return res.status(200).json({ message: 'get my online profile successfully', data: online_profile });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.createNewOnlineProfile = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const online_profile = await employeeServices_1.default.handleCreateNewOnlineProfile(userId, req.body);
        return res.status(201).json({ message: 'Create my new online profile successfully', data: online_profile });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.updateOnlineProfile = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const online_profile = await employeeServices_1.default.handleUpdateOnlineProfile(userId, req.body);
        return res.status(200).json({ message: 'Update my online profile successfully', data: online_profile });
    }
    catch (error) {
        next(error);
    }
};
// admin
EmployeeController.deleteOnlineProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'id is required');
        const online_profile = await employeeServices_1.default.handleDeleteOnlineProfile(id);
        return res.status(200).json({ message: 'remove online profile successfully', data: online_profile });
    }
    catch (error) {
        next(error);
    }
};
// online profile : another degree, education information, work experience
// 1. another degree
EmployeeController.createNewAnotherDegree = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const another_degree = await employeeServices_1.default.handleCreateNewAnotherDegree(userId, req.body);
        console.log(another_degree);
        return res.status(201).json({ message: 'Create new another degree successfully', data: another_degree });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.updateAnotherDegree = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const another_degree = await employeeServices_1.default.handleUpdateAnotherDegree(userId, id, req.body);
        return res.status(200).json({ message: 'Updated degree successfully', data: another_degree });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.deleteAnotherDegree = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        const another_degree = await employeeServices_1.default.handleDeleteAnotherDegree(userId, id);
        return res.status(200).json({ message: 'Delete degree successfully', data: another_degree });
    }
    catch (error) {
        next(error);
    }
};
// 2. education information
EmployeeController.createNewEducationInformation = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const education_information = await employeeServices_1.default.handleCreateNewEducationInformation(userId, req.body);
        return res.status(201).json({ message: 'Create new education information successfully', data: education_information });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.updateEducationInformation = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const education_information = await employeeServices_1.default.handleUpdateEducationInformation(userId, id, req.body);
        return res.status(200).json({ message: 'Update education information successfully', data: education_information });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.deleteEducationInformation = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        const education_informations = await employeeServices_1.default.handleDeleteEducationInformation(userId, id);
        return res.status(200).json({ message: 'Delete education information successfully', data: education_informations });
    }
    catch (error) {
        next(error);
    }
};
// 3. work experience
EmployeeController.createNewWorkExperience = async (req, res, next) => {
    try {
        const { userId } = req.user;
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const work_experience = await employeeServices_1.default.handleCreateNewWorkExperience(userId, req.body);
        return res.status(201).json({ message: 'Create new work experience successfully', data: work_experience });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.updateWorkExperience = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        if (!req.body)
            throw new httpException_1.HttpException(400, 'Invalid body');
        const workexperience = await employeeServices_1.default.handleUpdateWorkExperience(userId, id, req.body);
        return res.status(200).json({ message: 'Update education information successfully', data: workexperience });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.deleteWorkExperience = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        if (!id)
            throw new httpException_1.HttpException(400, 'Invalid id');
        const work_experience = await employeeServices_1.default.handleDeleteWorkExperience(userId, id);
        return res.status(200).json({ message: 'Delete work experience successfully', data: work_experience });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.getEmployeesByAdmin = async (req, res, next) => {
    try {
        const employees = await employeeServices_1.default.handleGetEmployeesByAdmin(req.query);
        return res.status(200).json({ message: 'get employees by admin successfully', data: employees });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.getLengthOfEmployeesByAdmin = async (req, res, next) => {
    try {
        const employees = await employeeServices_1.default.handleGetLengthOfEmployeesByAdmin(req.query);
        return res.status(200).json({ message: 'get length of employees by admin successfully', data: employees });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.getEmployeesByEmployer = async (req, res, next) => {
    try {
        const employees = await employeeServices_1.default.handleGetEmployeesByEmployer(req.query);
        return res.status(200).json({ message: 'get employees by employer successfully', data: employees });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.getLengthOfEmployeesByEmployer = async (req, res, next) => {
    try {
        const employees = await employeeServices_1.default.handleGetLengthOfEmployeesByEmployer(req.query);
        return res.status(200).json({ message: 'get length of employees by employer successfully', data: employees });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.getEmployeesByEmployerSortByKeywords = async (req, res, next) => {
    try {
        const { keywords, num, page } = req.query;
        if (!keywords)
            throw new httpException_1.HttpException(400, 'Invalid keywords');
        if (!page)
            req.query.page = 1;
        if (!num)
            req.query.num = 10;
        const employees = await employeeServices_1.default.handleGetEmployeesByEmployerSortByKeywords(req.query);
        return res.status(employees.status).json({
            message: employees.message,
            status: employees.status,
            data: employees.data
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = EmployeeController;
//# sourceMappingURL=employeeController.js.map