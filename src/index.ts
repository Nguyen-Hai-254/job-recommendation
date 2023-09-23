import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors";
import { connectDB } from "./config/connectDB"
const routes = require('./routes/web')

require('dotenv').config();


let app = express();
app.use(cors({ credentials: true, origin: true }));


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



let port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log('BackEnd NodeJS is running on the port:', port);
})