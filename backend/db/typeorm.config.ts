import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'mysql',
  host: process.env.HOST,
  port: Number(process.env.PORT_MYSQL),
  username: process.env.USER_MYSQL,
  password: process.env.PSW_MYSQL,
  database: process.env.DB_NAME,
  entities: [
    `${__dirname}/../src/projects/**/*.entity{.ts,.js}`,
    `${__dirname}/../src/users/**/*.entity{.ts,.js}`,
    `${__dirname}/../src/project-shares/**/*.entity{.ts,.js}`,
  ],
  migrations: [`${__dirname}/migration/*{.ts,.js}`],
  migrationsTableName: 'migration',
  synchronize: false,
});
