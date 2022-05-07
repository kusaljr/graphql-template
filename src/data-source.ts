import "reflect-metadata"
import { DataSource } from "typeorm"
import { Media } from "./entity/Media"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [User, Media],
    migrations: [],
    subscribers: [],
})
