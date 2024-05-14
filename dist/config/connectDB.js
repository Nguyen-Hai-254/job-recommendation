"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.myDataSource = void 0;
const typeorm_1 = require("typeorm");
require('dotenv').config();
const port = process.env.PORT_DB || 3307;
exports.myDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.HOST || '127.0.0.1',
    port: +port,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "",
    database: (_a = process.env.DB_NAME) !== null && _a !== void 0 ? _a : "job-recommendation",
    entities: ["src/entity/*.ts"],
    logging: false,
    synchronize: true,
});
exports.connectDB = exports.myDataSource
    .initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
//# sourceMappingURL=connectDB.js.map