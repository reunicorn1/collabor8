import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@users/users.module';
import { ProjectsModule } from '@projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectSharesModule } from '@project-shares/project-shares.module';
import { Users } from '@users/user.entity';
import { Projects } from '@projects/project.entity';
import { Environment } from '@environment/environment-document.entity';

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
      entities: [Users, Projects, ProjectSharesModule],
      synchronize: true,
    }),
    TypeOrmModule.forRoot({
      name: 'mongoConnection',
      type: 'mongodb',
      url: `mongodb://${process.env.HOST}:${process.env.PORT_MONGO}/${process.env.DB_NAME}`,
      database: process.env.DB_NAME,
      entities: [Environment],
      synchronize: true,
    }),
    UsersModule,
    ProjectsModule,
    ProjectSharesModule,
    Environment,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
