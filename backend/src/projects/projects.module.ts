import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from './project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MYSQL_CONN } from '@constants';

@Module({
  imports: [TypeOrmModule.forFeature([Projects], MYSQL_CONN)],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
