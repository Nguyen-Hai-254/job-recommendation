"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const authController_1 = __importDefault(require("../controllers/authController"));
const route = express_1.default.Router();
route.post('/auth/register', authController_1.default.register);
route.post('/auth/login', authController_1.default.login);
route.get('/auth/logout', auth_1.verifyToken, authController_1.default.logOut);
route.post('/auth/change-password', auth_1.verifyToken, authController_1.default.changePassword);
route.post('/auth/request-password-reset', authController_1.default.requestPasswordReset);
route.post('/auth/reset-password', authController_1.default.resetPassword);
exports.default = route;
//# sourceMappingURL=authRoute.js.map