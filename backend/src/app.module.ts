import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@users/users.module';
import { ProjectsModule } from '@projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectSharesModule } from '@project-shares/project-shares.module';
import { Users } from '@users/user.entity';
import { Projects } from '@projects/project.entity';
import { EnvironmentModule } from './environment/environment.module';

/**
 * TODO:
 * 1. probably this file needs to be revisit for
 *  - DB name
 *  - DB psw
 *  - username setup
 *  - kitchen sink
 */
@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'mysqlConnection',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'users_db',
      entities: [Users, Projects, ProjectSharesModule],
      synchronize: true,
    }),
    TypeOrmModule.forRoot({
      name: 'mongoConnection',
      type: 'mongodb',
      url: 'mongodb://localhost:27017/projects_db',
      database: 'projects_db',
      entities: [Environment],
      synchronize: true,
    }),
    UsersModule,
    ProjectsModule,
    ProjectSharesModule,
    EnvironmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
