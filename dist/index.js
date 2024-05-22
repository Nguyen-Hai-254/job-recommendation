"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = require("express-rate-limit");
const connectDB_1 = require("./config/connectDB");
const error_1 = require("./middlewares/error");
const httpException_1 = require("./exceptions/httpException");
const cronJob = require('./cron/updateExpiredJobStatusCron');
let app = (0, express_1.default)();
const routes = require('./routes/web');
// 1. connect to database
(0, connectDB_1.connectDB)();
// 2. initializeMiddlewares
// 2.1. cors
const corsOptions = {
    origin: process.env.ORIGIN,
    credentials: true,
    optionSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', process.env.ORIGIN);
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});
// 2.2.
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// 2.3. express-rate-limit
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 1 * 60 * 1000,
    max: 100,
    handler: (req, res, next) => {
        throw new httpException_1.HttpException(429, 'Too many requests, please try again later.');
    }
});
app.use(limiter);
// 3. initializeRoutes
// 3.1. set default prefix
app.use('/api/v1', routes);
// 3.2. Invalid route
app.use("*", (req, res) => {
    return res.status(404).json({
        success: false,
        message: "Invalid route"
    });
});
// 4. Cron
cronJob.start();
// 5. initializeErrorHandling
app.use(error_1.errorMiddleware);
let port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log('BackEnd NodeJS is running on the port:', port);
});
//# sourceMappingURL=index.js.map