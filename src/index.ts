require('dotenv').config();

import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import { connectDB } from "./config/connectDB"
import { errorMiddleware } from "./middleware/error";

const cronJob =  require('./cron/updateExpiredJobStatusCron')
const routes = require('./routes/web')

let app = express();

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


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


connectDB;
app.use('/', routes)
app.use("*", (req, res) => {
    return res.status(404).json({
        success: false,
        message: "Invalid route"
    })
});

cronJob.start();

let port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log('BackEnd NodeJS is running on the port:', port);
})

app.use(errorMiddleware);