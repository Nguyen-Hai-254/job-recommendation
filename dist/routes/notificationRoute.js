"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const paginationParser_1 = require("../middlewares/paginationParser");
const notificationController_1 = __importDefault(require("../controllers/notificationController"));
const route = express_1.default.Router();
route.get('/user/notifications', auth_1.verifyToken, paginationParser_1.paginationParser, notificationController_1.default.getNotificationsByUser);
exports.default = route;
//# sourceMappingURL=notificationRoute.js.map