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
const connectDB_1 = require("./config/connectDB");
const cronJob = require('./cron/updateExpiredJobStatusCron');
const routes = require('./routes/web');
let app = (0, express_1.default)();
// app.use(cors({ credentials: true, origin: true }));
const corsOptions = {
    origin: 'http://vieclam.infotechacademy.vn',
    credentials: true,
    optionSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "http://vieclam.infotechacademy.vn");
    res.header('Access-Control-Allow-Headers', '*');
    // res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
connectDB_1.connectDB;
app.use('/', routes);
app.use("*", (req, res) => {
    return res.status(404).json({
        success: false,
        message: "Invalid route"
    });
});
cronJob.start();
let port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log('BackEnd NodeJS is running on the port:', port);
});
//# sourceMappingURL=index.js.map