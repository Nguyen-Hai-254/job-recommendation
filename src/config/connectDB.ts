import { DataSource } from "typeorm"
require('dotenv').config();

const port = process.env.PORT_DB || 3307;

export const myDataSource = new DataSource({
    type: "mysql",
    host: process.env.HOST || '127.0.0.1',
    port: +port,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "",
    database: process.env.DB_NAME ?? "job-recommendation",
    entities: [__dirname + '/../entity/*.{js,ts}'],
    logging: false,
    // dropSchema: true,
    synchronize: true,
    // timezone: 'Z'

})

export let connectDB = myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })