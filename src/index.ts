require('dotenv').config();

import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import { rateLimit } from 'express-rate-limit'

import { connectDB } from "./config/connectDB"
import { errorMiddleware } from "./middlewares/error"
import { HttpException } from "./exceptions/httpException";
const cronJob =  require('./cron/updateExpiredJobStatusCron')

let app = express();
const routes = require('./routes/web')

// 1. connect to database
connectDB();

// 2. initializeMiddlewares
// 2.1. cors
const corsOptions = {
    origin: process.env.ORIGIN,
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', process.env.ORIGIN);
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});
// 2.2.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// 2.3. express-rate-limit
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 phút
    max: 100,
    handler: (req, res, next) => {
        throw new HttpException(429, 'Too many requests, please try again later.');
    }
});
app.use(limiter);

// 3. initializeRoutes
// 3.1. set default prefix
app.use('/api/v1', routes)
// 3.2. Invalid route
app.use("*", (req, res) => {
    return res.status(404).json({
        success: false,
        message: "Invalid route"
    })
});

// 4. Cron
cronJob.start();

// 5. initializeErrorHandling
app.use(errorMiddleware);

let port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log('BackEnd NodeJS is running on the port:', port);
})
