import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@users/users.module';
import { Users } from '@users/user.entity';
import { ProjectsModule } from '@projects/projects.module';
import { ProjectShares } from '@project-shares/project-shares.entity';
import { ProjectSharesModule } from '@project-shares/project-shares.module';
import { ProjectSharesMongoModule } from '@project-shares-mongo/project-shares-mongo.module';
import { ProjectSharesMongo } from '@project-shares-mongo/project-shares-mongo.entity';
import { Projects } from '@projects/project.entity';
import { FileMongoModule } from '@file-mongo/file-mongo.module';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';
import { EnvironmentMongo } from '@envrionment-mongo/envrionment-mongo.entity';
import { EnvironmentMongoModule } from '@envrionment-mongo/envrionment-mongo.module';
import { DirectoryMongoModule } from '@directory-mongo/directory-mongo.module';
import { DirectoryMongo } from '@directory-mongo/directory-mongo.entity';
import { ProjectMongoModule } from '@project-mongo/project-mongo.module';
import { FileMongo } from '@file-mongo/file-mongo.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), //  load .env
    TypeOrmModule.forRoot({
      name: 'mysqlConnection',
      type: 'mysql',
      host: process.env.HOST,
      port: Number(process.env.PORT_MYSQL),
      username: process.env.USER_MYSQL,
      password: process.env.PSW_MYSQL,
      database: process.env.DB_NAME,
      entities: [Users, Projects, ProjectShares],
      synchronize: true,
    }),
    TypeOrmModule.forRoot({
      name: 'mongoConnection',
      type: 'mongodb',
      url: `mongodb://${process.env.HOST}:${process.env.PORT_MONGO}/${process.env.DB_NAME}`,
      database: process.env.DB_NAME,
      entities: [
        EnvironmentMongo,
        ProjectMongo,
        ProjectSharesMongo,
        DirectoryMongo,
        FileMongo,
      ],
      synchronize: true,
    }),
    UsersModule,
    ProjectsModule,
    ProjectSharesModule,
    DirectoryMongoModule,
    ProjectMongoModule,
    ProjectSharesMongoModule,
    FileMongoModule,
    EnvironmentMongoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
