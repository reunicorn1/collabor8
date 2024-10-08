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
import { Projects } from '@projects/project.entity';
import { FileMongoModule } from '@file-mongo/file-mongo.module';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';
import { EnvironmentMongo } from '@environment-mongo/environment-mongo.entity';
import { EnvironmentMongoModule } from '@environment-mongo/environment-mongo.module';
import { DirectoryMongoModule } from '@directory-mongo/directory-mongo.module';
import { DirectoryMongo } from '@directory-mongo/directory-mongo.entity';
import { ProjectMongoModule } from '@project-mongo/project-mongo.module';
import { FileMongo } from '@file-mongo/file-mongo.entity';
import { AuthModule } from '@auth/auth.module';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AdminModule } from '@admin/admin.module';
import { MailModule } from '@mail/mail.module';
import { RedisService } from '@redis/redis.service';
import { RedisModule } from '@redis/redis.module';
import { LoggingModule } from '@logging/logging.module';
import { BullModule } from '@nestjs/bullmq';
import { MYSQL_CONN, MONGO_CONN } from '@constants';
import { DockerModule } from './docker/docker.module';
import { GuestModule } from './guest/guest.module';
import { ProjectManagerModule } from './project-manager/project-manager.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }), //  load .env
    BullModule.forRoot({ // 👈️ Job Queue
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'project-manager',
    }),
    TypeOrmModule.forRoot({
      name: MYSQL_CONN,
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
      name: MONGO_CONN,
      type: 'mongodb',
      url: `mongodb://${process.env.HOST}:${process.env.PORT_MONGO}/${process.env.DB_NAME}`,
      database: process.env.DB_NAME,
      entities: [
        EnvironmentMongo,
        ProjectMongo,
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
    FileMongoModule,
    EnvironmentMongoModule,
    AuthModule,
    AdminModule,
    MailModule,
    RedisModule,
    LoggingModule,
    DockerModule,
    GuestModule,
    ProjectManagerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // HocuspocusService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    RedisService,
  ],
})
export class AppModule { }
