import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '@users/users.module';
import { ProjectsModule } from '@projects/projects.module';
import { FileMongoModule } from '@file-mongo/file-mongo.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@auth/guards/roles.guard';

@Module({
  imports: [
    UsersModule,
    ProjectsModule,
    FileMongoModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    AdminService,
  ],
  controllers: [AdminController],
  exports: [AdminService],

})
export class AdminModule {}
