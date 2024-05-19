"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const authController_1 = __importDefault(require("../controllers/authController"));
const route = express_1.default.Router();
route.post('/api/v1/auth/register', authController_1.default.register);
route.post('/api/v1/auth/login', authController_1.default.login);
route.get('/api/v1/auth/logout', auth_1.verifyToken, authController_1.default.logOut);
route.post('/api/v1/auth/password', auth_1.verifyToken, authController_1.default.resetPassword);
exports.default = route;
//# sourceMappingURL=authRoute.js.map