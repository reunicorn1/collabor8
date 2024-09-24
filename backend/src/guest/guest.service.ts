import { Injectable } from '@nestjs/common';
import { ProjectsService } from '@projects/projects.service';
import { Projects } from '@projects/project.entity';
import { RedisService } from '@redis/redis.service';
import { GUEST_USER } from '@constants';

@Injectable()
export class GuestService {
  constructor(
    private readonly projectService: ProjectsService,
    private readonly redisService: RedisService,
  ) {}


  /**
   * create a prjoect for the guest user (only one project per guest)
   * @param {string} IP - IP address of the guest user
   * @returns projectInfo
   */
  async createOrGetProject(IP: string): Promise<Projects> {
    // create a new project for each guest user
    // when clicking on try it out button
    const project_id = await this.redisService.get(IP);
    if (project_id) {
      return (await this.projectService.findMyProject(
        project_id,
        GUEST_USER,
      )) as Projects;
    }
    const project = await this.projectService.create({
      project_name: `project-${new Date().getTime()}`,
      username: GUEST_USER,
      description: 'Guest project',
    });
    // persist on redis for 24h
    this.redisService.set(IP, project.project_id, 60 * 60 * 24);

    return project;
  }
}
