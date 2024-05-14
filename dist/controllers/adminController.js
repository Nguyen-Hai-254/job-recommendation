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
const adminServices_1 = __importDefault(require("../services/adminServices"));
class AdminController {
}
_a = AdminController;
AdminController.jobPostingsReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobPostings = yield adminServices_1.default.handleGetJobPostingsReport();
        return res.status(jobPostings.status).json({
            message: jobPostings.message,
            status: jobPostings.status,
            data: jobPostings.data ? jobPostings.data : []
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
AdminController.candidateStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield adminServices_1.default.handleCandidateStatistics();
        return res.status(data.status).json({
            message: data.message,
            status: data.status,
            data: data.data ? data.data : []
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
AdminController.getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUser = yield adminServices_1.default.handleGetAllUser(req);
        return res.status(allUser.status).json({
            message: allUser.message,
            status: allUser.status,
            data: allUser.data ? allUser.data : []
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
AdminController.getTotalUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUser = yield adminServices_1.default.handleGetTotalUser(req);
        return res.status(totalUser.status).json({
            message: totalUser.message,
            status: totalUser.status,
            data: totalUser.data ? totalUser.data : []
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
AdminController.sendEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.emails || !req.body.subject || !req.body.html) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const result = yield adminServices_1.default.handleSendEmail(req.body.emails, req.body.subject, req.body.html);
        return res.status(result.status).json({
            message: result.message,
            status: result.status,
            data: result.data ? result.data : []
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
AdminController.searchEmailOrName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.keyword) {
            return res.status(500).json({
                message: "Missing input parameter!",
                status: 500,
                error: 'Internal Server Error',
            });
        }
        const result = yield adminServices_1.default.handleSearchEmailOrName(req.body.keyword);
        return res.status(result.status).json({
            message: result.message,
            status: result.status,
            data: result.data ? result.data : []
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
exports.default = AdminController;
//# sourceMappingURL=adminController.js.map