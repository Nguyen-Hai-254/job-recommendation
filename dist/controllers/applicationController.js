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
const applicationServices_1 = __importDefault(require("../services/applicationServices"));
class ApplicationController {
}
_a = ApplicationController;
ApplicationController.getApplicationsbyEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield applicationServices_1.default.handleGetApplicationsbyEmployee(req);
        return res.status(applications.status).json({
            message: applications.message,
            status: 200,
            data: applications.data ? applications.data : []
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
ApplicationController.getApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const application = yield applicationServices_1.default.handleGetApplication(req);
        return res.status(application.status).json({
            message: application.message,
            status: application.status,
            data: application.data
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
ApplicationController.createNewApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const application = yield applicationServices_1.default.handleCreateNewApplication(req);
        return res.status(application.status).json({
            message: application.message,
            status: application.status,
            data: application.data
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
ApplicationController.getApplicationsbyEmployer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield applicationServices_1.default.handleGetApplicationsbyEmployer(req);
        return res.status(applications.status).json({
            message: applications.message,
            status: 200,
            data: applications.data ? applications.data : []
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
ApplicationController.getLengthOfApplicationsbyEmployer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield applicationServices_1.default.handleGetLengthOfApplicationsbyEmployer(req);
        return res.status(applications.status).json({
            message: applications.message,
            status: 200,
            data: applications.data ? applications.data : []
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
ApplicationController.getApplicationbyEmployer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield applicationServices_1.default.handleGetApplicationbyEmployer(req);
        return res.status(applications.status).json({
            message: applications.message,
            status: 200,
            data: applications.data ? applications.data : []
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
ApplicationController.updateApplicationbyEmployer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const application = yield applicationServices_1.default.handleUpdateApplicationbyEmployer(req);
        return res.status(application.status).json({
            message: application.message,
            status: application.status,
            data: application.data
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
ApplicationController.getAllApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield applicationServices_1.default.handleGetAllApplications();
        return res.status(applications.status).json({
            message: applications.message,
            status: applications.status,
            data: applications.data ? applications.data : []
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
exports.default = ApplicationController;
//# sourceMappingURL=applicationController.js.map