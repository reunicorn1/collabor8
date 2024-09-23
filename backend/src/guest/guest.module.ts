import { Module } from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.module';
import { ProjectsModule } from '@projects/projects.module';

@Module({
  imports: [AuthModule, UsersModule, ProjectsModule],
  providers: [GuestService],
  controllers: [GuestController],
})
export class GuestModule {}
