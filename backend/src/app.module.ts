import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@users/users.module';
import { ProjectsModule } from '@projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectShares } from '@project-shares/project-shares.entity';
import { ProjectSharesModule } from '@project-shares/project-shares.module';
import { Users } from '@users/user.entity';
import { Projects } from '@projects/project.entity';
import { EnvironmentMongo } from '@envrionment-mongo/envrionment-mongo.entity';
import { DirectoryMongoModule } from '@directory-mongo/directory-mongo.module';
import { ProjectMongoModule } from '@project-mongo/project-mongo.module';
import { ProjectSharesMongoModule } from '@project-shares-mongo/project-shares-mongo.module';
import { FileMongoModule } from '@file-mongo/file-mongo.module';
import { EnvrionmentMongoModule } from '@envrionment-mongo/envrionment-mongo.module';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';
import { DirectoryMongo } from '@directory-mongo/directory-mongo.entity';
import { FileMongo } from '@file-mongo/file-mongo.entity';
import { ProjectSharesMongo } from '@project-shares-mongo/project-shares-mongo.entity';

@Module({
  imports: [
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
    EnvrionmentMongoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
