"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const employeeServices_1 = __importDefault(require("../services/employeeServices"));
class EmployeeController {
}
_a = EmployeeController;
EmployeeController.getAttachedDocument = async (req, res, next) => {
    try {
        const attached_document = await employeeServices_1.default.handleGetAttachedDocument(req);
        return res.status(attached_document.status).json({
            message: attached_document.message,
            status: attached_document.status,
            data: attached_document.data
        });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.createNewAttachedDocument = async (req, res, next) => {
    try {
        const attached_document = await employeeServices_1.default.handleCreateNewAttachedDocument(req);
        return res.status(attached_document.status).json({
            message: attached_document.message,
            status: attached_document.status,
            data: attached_document.data
        });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.updateAttachedDocument = async (req, res, next) => {
    try {
        const attached_document = await employeeServices_1.default.handleUpdateAttachedDocument(req);
        return res.status(attached_document.status).json({
            message: attached_document.message,
            status: attached_document.status,
            data: attached_document.data
        });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.deleteAttachedDocument = async (req, res, next) => {
    try {
        const attached_document = await employeeServices_1.default.handleDeleteAttachedDocument(req);
        return res.status(attached_document.status).json({
            message: attached_document.message,
            status: attached_document.status,
            data: attached_document.data
        });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.getOnlineProfile = async (req, res, next) => {
    try {
        const online_profile = await employeeServices_1.default.handleGetOnlineProfile(req);
        return res.status(online_profile.status).json({
            message: online_profile.message,
            status: online_profile.status,
            data: online_profile.data
        });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.createNewOnlineProfile = async (req, res, next) => {
    try {
        const online_profile = await employeeServices_1.default.handleCreateNewOnlineProfile(req);
        return res.status(online_profile.status).json({
            message: online_profile.message,
            status: online_profile.status,
            data: online_profile.data
        });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.updateOnlineProfile = async (req, res, next) => {
    try {
        const online_profile = await employeeServices_1.default.handleUpdateOnlineProfile(req);
        return res.status(online_profile.status).json({
            message: online_profile.message,
            status: online_profile.status,
            data: online_profile.data
        });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.deleteOnlineProfile = async (req, res, next) => {
    try {
        const online_profile = await employeeServices_1.default.handleDeleteOnlineProfile(req);
        return res.status(online_profile.status).json({
            message: online_profile.message,
            status: online_profile.status,
            data: online_profile.data
        });
    }
    catch (error) {
        next(error);
    }
};
// online profile : another degree, education information, work experience
// 1. another degree
EmployeeController.createNewAnotherDegree = async (req, res, next) => {
    try {
        const another_degrees = await employeeServices_1.default.handleCreateNewAnotherDegree(req);
        return res.status(another_degrees.status).json({
            message: another_degrees.message,
            status: another_degrees.status,
            data: another_degrees.data
        });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.updateAnotherDegree = async (req, res, next) => {
    try {
        const another_degree = await employeeServices_1.default.handleUpdateAnotherDegree(req);
        return res.status(another_degree.status).json({
            message: another_degree.message,
            status: another_degree.status,
            data: another_degree.data
        });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.deleteAnotherDegree = async (req, res, next) => {
    try {
        const another_degree = await employeeServices_1.default.handleDeleteAnotherDegree(req);
        return res.status(another_degree.status).json({
            message: another_degree.message,
            status: another_degree.status,
            data: another_degree.data
        });
    }
    catch (error) {
        next(error);
    }
};
// 2. education information
EmployeeController.createNewEducationInformation = async (req, res, next) => {
    try {
        const education_informations = await employeeServices_1.default.handleCreateNewEducationInformation(req);
        return res.status(education_informations.status).json({
            message: education_informations.message,
            status: education_informations.status,
            data: education_informations.data
        });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.updateEducationInformation = async (req, res, next) => {
    try {
        const education_informations = await employeeServices_1.default.handleUpdateEducationInformation(req);
        return res.status(education_informations.status).json({
            message: education_informations.message,
            status: education_informations.status,
            data: education_informations.data
        });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.deleteEducationInformation = async (req, res, next) => {
    try {
        const education_informations = await employeeServices_1.default.handleDeleteEducationInformation(req);
        return res.status(education_informations.status).json({
            message: education_informations.message,
            status: education_informations.status,
            data: education_informations.data
        });
    }
    catch (error) {
        next(error);
    }
};
// 3. work experience
EmployeeController.createNewWorkExperience = async (req, res, next) => {
    try {
        const workexperiences = await employeeServices_1.default.handleCreateNewWorkExperience(req);
        return res.status(workexperiences.status).json({
            message: workexperiences.message,
            status: workexperiences.status,
            data: workexperiences.data
        });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.updateWorkExperience = async (req, res, next) => {
    try {
        const workexperiences = await employeeServices_1.default.handleUpdateWorkExperience(req);
        return res.status(workexperiences.status).json({
            message: workexperiences.message,
            status: workexperiences.status,
            data: workexperiences.data
        });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.deleteWorkExperience = async (req, res, next) => {
    try {
        const workexperiences = await employeeServices_1.default.handleDeleteWorkExperience(req);
        return res.status(workexperiences.status).json({
            message: workexperiences.message,
            status: workexperiences.status,
            data: workexperiences.data
        });
    }
    catch (error) {
        next(error);
    }
};
EmployeeController.getEmployeesByAdmin = async (req, res, next) => {
    try {
        const employees = await employeeServices_1.default.handleGetEmployeesByAdmin(req);
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
EmployeeController.getLengthOfEmployeesByAdmin = async (req, res, next) => {
    try {
        const employees = await employeeServices_1.default.handleGetLengthOfEmployeesByAdmin(req);
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
EmployeeController.getEmployeesByEmployer = async (req, res, next) => {
    try {
        const employees = await employeeServices_1.default.handleGetEmployeesByEmployer(req);
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
EmployeeController.getLengthOfEmployeesByEmployer = async (req, res, next) => {
    try {
        const employees = await employeeServices_1.default.handleGetLengthOfEmployeesByEmployer(req);
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
EmployeeController.getEmployeesByEmployerSortByKeywords = async (req, res, next) => {
    try {
        const employees = await employeeServices_1.default.handleGetEmployeesByEmployerSortByKeywords(req);
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