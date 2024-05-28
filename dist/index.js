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
const bull_1 = __importDefault(require("bull"));
const api_1 = require("@bull-board/api");
const bullAdapter_1 = require("@bull-board/api/bullAdapter");
const express_2 = require("@bull-board/express");
const config_1 = require("./config");
const connectDB_1 = require("./config/connectDB");
const error_1 = require("./middlewares/error");
const httpException_1 = require("./exceptions/httpException");
const cronJob = require('./cron/updateExpiredJobStatusCron');
// 0. queues
const serverAdapter = new express_2.ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
const queues = config_1.queuesList
    .map((qs) => new bull_1.default(qs, config_1.queueOptions))
    .map((q) => new bullAdapter_1.BullAdapter(q));
const { addQueue, removeQueue, setQueues, replaceQueues } = (0, api_1.createBullBoard)({
    queues,
    serverAdapter: serverAdapter,
});
// set up
const app = (0, express_1.default)();
const routes = require('./routes/web');
// 1. connect to database
(0, connectDB_1.connectDB)();
// 2. initializeMiddlewares
// 2.1. cors
var corsOptions = {
    origin: function (origin, callback) {
        if (origin == process.env.ORIGIN || process.env.ORIGIN == '*') {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
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
app.use('/admin/queues', serverAdapter.getRouter());
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
require('./workers');
// 5. initializeErrorHandling
app.use(error_1.errorMiddleware);
app.listen(config_1.PORT, () => {
    console.info('BackEnd NodeJS is running on the port:', config_1.PORT);
    console.info(`For the UI, open http://localhost:${config_1.PORT}/admin/queues`);
});
//# sourceMappingURL=index.js.map