import "reflect-metadata"
import { DataSource } from "typeorm"
import { Users } from "./entity/Users"
import { Projects } from "./entity/Projects"
import { ProjectShares } from "./entity/ProjectShares"


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "admin",
    password: "adminpwd",
    database: "collabor8",
    synchronize: false,
    logging: true,
    entities: [Users, Projects, ProjectShares],
    migrations: ["migration/**/*.ts"],
    subscribers: [],
})
