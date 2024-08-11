import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectSharesModule } from './project-shares/project-shares.module';

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
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forRoot({
      name: 'mongoConnection',
      type: 'mongodb',
      url: 'mongodb://localhost:27017/projects_db',
      database: 'projects_db',
      entities: [Project],
      synchronize: true,
    }),
    UsersModule,
    ProjectsModule,
    ProjectSharesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
