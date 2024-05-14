"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const employeeServices_1 = __importDefault(require("../services/employeeServices"));
class EmployeeController {
}
_a = EmployeeController;
EmployeeController.getAttachedDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attached_document = yield employeeServices_1.default.handleGetAttachedDocument(req);
        return res.status(attached_document.status).json({
            message: attached_document.message,
            status: attached_document.status,
            data: attached_document.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.createNewAttachedDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attached_document = yield employeeServices_1.default.handleCreateNewAttachedDocument(req);
        return res.status(attached_document.status).json({
            message: attached_document.message,
            status: attached_document.status,
            data: attached_document.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.updateAttachedDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attached_document = yield employeeServices_1.default.handleUpdateAttachedDocument(req);
        return res.status(attached_document.status).json({
            message: attached_document.message,
            status: attached_document.status,
            data: attached_document.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.deleteAttachedDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attached_document = yield employeeServices_1.default.handleDeleteAttachedDocument(req);
        return res.status(attached_document.status).json({
            message: attached_document.message,
            status: attached_document.status,
            data: attached_document.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.getOnlineProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const online_profile = yield employeeServices_1.default.handleGetOnlineProfile(req);
        return res.status(online_profile.status).json({
            message: online_profile.message,
            status: online_profile.status,
            data: online_profile.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.createNewOnlineProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const online_profile = yield employeeServices_1.default.handleCreateNewOnlineProfile(req);
        return res.status(online_profile.status).json({
            message: online_profile.message,
            status: online_profile.status,
            data: online_profile.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.updateOnlineProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const online_profile = yield employeeServices_1.default.handleUpdateOnlineProfile(req);
        return res.status(online_profile.status).json({
            message: online_profile.message,
            status: online_profile.status,
            data: online_profile.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.deleteOnlineProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const online_profile = yield employeeServices_1.default.handleDeleteOnlineProfile(req);
        return res.status(online_profile.status).json({
            message: online_profile.message,
            status: online_profile.status,
            data: online_profile.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.createNewAnotherDegree = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const another_degrees = yield employeeServices_1.default.handleCreateNewAnotherDegree(req);
        return res.status(another_degrees.status).json({
            message: another_degrees.message,
            status: another_degrees.status,
            data: another_degrees.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.updateAnotherDegree = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const another_degree = yield employeeServices_1.default.handleUpdateAnotherDegree(req);
        return res.status(another_degree.status).json({
            message: another_degree.message,
            status: another_degree.status,
            data: another_degree.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.deleteAnotherDegree = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const another_degree = yield employeeServices_1.default.handleDeleteAnotherDegree(req);
        return res.status(another_degree.status).json({
            message: another_degree.message,
            status: another_degree.status,
            data: another_degree.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.createNewEducationInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const education_informations = yield employeeServices_1.default.handleCreateNewEducationInformation(req);
        return res.status(education_informations.status).json({
            message: education_informations.message,
            status: education_informations.status,
            data: education_informations.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.updateEducationInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const education_informations = yield employeeServices_1.default.handleUpdateEducationInformation(req);
        return res.status(education_informations.status).json({
            message: education_informations.message,
            status: education_informations.status,
            data: education_informations.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.deleteEducationInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const education_informations = yield employeeServices_1.default.handleDeleteEducationInformation(req);
        return res.status(education_informations.status).json({
            message: education_informations.message,
            status: education_informations.status,
            data: education_informations.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.createNewWorkExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workexperiences = yield employeeServices_1.default.handleCreateNewWorkExperience(req);
        return res.status(workexperiences.status).json({
            message: workexperiences.message,
            status: workexperiences.status,
            data: workexperiences.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.updateWorkExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workexperiences = yield employeeServices_1.default.handleUpdateWorkExperience(req);
        return res.status(workexperiences.status).json({
            message: workexperiences.message,
            status: workexperiences.status,
            data: workexperiences.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.deleteWorkExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workexperiences = yield employeeServices_1.default.handleDeleteWorkExperience(req);
        return res.status(workexperiences.status).json({
            message: workexperiences.message,
            status: workexperiences.status,
            data: workexperiences.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.getEmployeesByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield employeeServices_1.default.handleGetEmployeesByAdmin(req);
        return res.status(employees.status).json({
            message: employees.message,
            status: employees.status,
            data: employees.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.getLengthOfEmployeesByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield employeeServices_1.default.handleGetLengthOfEmployeesByAdmin(req);
        return res.status(employees.status).json({
            message: employees.message,
            status: employees.status,
            data: employees.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.getEmployeesByEmployer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield employeeServices_1.default.handleGetEmployeesByEmployer(req);
        return res.status(employees.status).json({
            message: employees.message,
            status: employees.status,
            data: employees.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.getLengthOfEmployeesByEmployer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield employeeServices_1.default.handleGetLengthOfEmployeesByEmployer(req);
        return res.status(employees.status).json({
            message: employees.message,
            status: employees.status,
            data: employees.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
EmployeeController.getEmployeesByEmployerSortByKeywords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield employeeServices_1.default.handleGetEmployeesByEmployerSortByKeywords(req);
        return res.status(employees.status).json({
            message: employees.message,
            status: employees.status,
            data: employees.data
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
exports.default = EmployeeController;
//# sourceMappingURL=employeeController.js.map