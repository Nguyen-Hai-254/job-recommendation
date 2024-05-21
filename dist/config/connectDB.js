"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.myDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.myDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../entities/*.{js,ts}'],
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