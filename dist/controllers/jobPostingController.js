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
const jobpostingServices_1 = __importDefault(require("../services/jobpostingServices"));
class JobPostingController {
}
_a = JobPostingController;
JobPostingController.getAllJobPostings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobPostings = yield jobpostingServices_1.default.handleGetAllJobPostings(req);
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
JobPostingController.getLengthOfAllJobPostings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobPostings = yield jobpostingServices_1.default.handleGetLengthOfAllJobPostings(req);
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
JobPostingController.getAllJobPostingsByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobPostings = yield jobpostingServices_1.default.handleGetAllJobPostingsByAdmin(req);
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
JobPostingController.getLengthOfAllJobPostingsByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobPostings = yield jobpostingServices_1.default.handleGetLengthOfAllJobPostingsByAdmin(req);
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
JobPostingController.getTotalResultsOfProfession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobPostings = yield jobpostingServices_1.default.handleGetTotalResultsOfProfession();
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
JobPostingController.getTotalResultsOfProfessionByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobPostings = yield jobpostingServices_1.default.handleGetTotalResultsOfProfessionByAdmin(req);
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
JobPostingController.getJobPostingsByEmployer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobPostings = yield jobpostingServices_1.default.handleGetJobPostingsByEmployer(req);
        return res.status(jobPostings.status).json({
            message: jobPostings.message,
            status: 200,
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
JobPostingController.getJobPosting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobPosting = yield jobpostingServices_1.default.handleGetJobPosting(req);
        return res.status(jobPosting.status).json({
            message: jobPosting.message,
            status: jobPosting.status,
            data: jobPosting.data
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
JobPostingController.getJobPostingByEmployer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobPosting = yield jobpostingServices_1.default.handleGetJobPostingByEmployer(req);
        return res.status(jobPosting.status).json({
            message: jobPosting.message,
            status: jobPosting.status,
            data: jobPosting.data
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
JobPostingController.deleteJobPosting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobPosting = yield jobpostingServices_1.default.handleDeleteJobPosting(req);
        return res.status(jobPosting.status).json({
            message: jobPosting.message,
            status: jobPosting.status,
            data: jobPosting.data
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
JobPostingController.updateJobPosting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobPosting = yield jobpostingServices_1.default.handleUpdateJobPosting(req);
        return res.status(jobPosting.status).json({
            message: jobPosting.message,
            status: jobPosting.status,
            data: jobPosting.data
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
JobPostingController.createNewJobPosting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobPosting = yield jobpostingServices_1.default.handleCreateNewJobPosting(req);
        return res.status(jobPosting.status).json({
            message: jobPosting.message,
            status: jobPosting.status,
            data: jobPosting.data
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
JobPostingController.updateApprovalStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield jobpostingServices_1.default.handleUpdateApprovalStatus(req);
        return res.status(post.status).json({
            message: post.message,
            status: post.status,
            data: post.data
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
exports.default = JobPostingController;
//# sourceMappingURL=jobPostingController.js.map