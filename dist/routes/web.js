"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoute_1 = __importDefault(require("./userRoute"));
const postRoute_1 = __importDefault(require("./postRoute"));
const applicationRoute_1 = __importDefault(require("./applicationRoute"));
const employeeRoute_1 = __importDefault(require("./employeeRoute"));
const utilsRoute_1 = __importDefault(require("./utilsRoute"));
const followRoute_1 = __importDefault(require("./followRoute"));
const adminRoute_1 = __importDefault(require("./adminRoute"));
const authRoute_1 = __importDefault(require("./authRoute"));
const route = express_1.default.Router();
route.use('/', authRoute_1.default);
route.use('/', userRoute_1.default);
route.use('/', postRoute_1.default);
route.use('/', applicationRoute_1.default);
route.use('/', employeeRoute_1.default);
route.use('/', utilsRoute_1.default);
route.use('/', followRoute_1.default);
route.use('/', adminRoute_1.default);
module.exports = route;
//# sourceMappingURL=web.js.map