import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from 'src/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@auth/guards/roles.guard';

@Module({
  imports: [UsersModule],
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
