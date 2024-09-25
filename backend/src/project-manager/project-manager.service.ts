import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ProjectsService } from '@projects/projects.service';
import { ProjectSharesService } from '@project-shares/project-shares.service';
import { RedisService } from '@redis/redis.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';

@Processor('project-manager')
@Injectable()
export class ProjectManagerService extends WorkerHost {
  constructor(
    @InjectQueue('project-manager') private readonly projectManagerQueue: Queue,
    private readonly projectsService: ProjectsService,
    private readonly projectSharesService: ProjectSharesService,
    private readonly redisService: RedisService,
  ) {
    super();
  }

  async process(job: any) {
    console.log('processing job:', job);
    switch (job.name) {
      case 'delete-project':
        return this.processDeleteProject(job);
      case 'delete-project-shares':
        return this.processDeleteProjectShares(job);
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  async scheduleProjectDeletion(project_id: string, hours: number) {
    const delay = hours * 60 * 60 * 1000;
    const job = await this.projectManagerQueue.add('delete-project', { project_id }, { delay });
    // cache the job id for later retrieval
    await this.redisService.set(`project-manager-job:${project_id}`, job.id);

    return job.id;
  }

  async cancelProjectDeletion(project_id: string) {
    const jobId = await this.redisService.get(`project-manager-job:${project_id}`);
    if (jobId) {
      await this.projectManagerQueue.remove(jobId);
      await this.redisService.del(`project-manager-job:${project_id}`);
    }
  }

  async rescheduleProjectDeletion(project_id: string, hours: number) {
    await this.cancelProjectDeletion(project_id);
    return this.scheduleProjectDeletion(project_id, hours);
  }

  async processDeleteProject(job: any) {
    const { project_id } = job.data;
    await this.projectsService.remove(project_id);
    await this.redisService.del(`project-manager-job:${project_id}`);
  }

  async scheduleProjectSharesDeletion(share_id: string, hours: number) {
    const delay = hours * 60 * 60 * 1000;
    const job = await this.projectManagerQueue.add('delete-project-shares', { share_id }, { delay });
    // cache the job id for later retrieval
    await this.redisService.set(`project-manager-job:${share_id}`, job.id);

    return job.id;
  }

  async cancelProjectSharesDeletion(share_id: string) {
    const jobId = await this.redisService.get(`project-manager-job:${share_id}`);
    if (jobId) {
      await this.projectManagerQueue.remove(jobId);
      await this.redisService.del(`project-manager-job:${share_id}`);
    }
  }

  async rescheduleProjectSharesDeletion(share_id: string, hours: number) {
    await this.cancelProjectSharesDeletion(share_id);
    return this.scheduleProjectSharesDeletion(share_id, hours);
  }

  async processDeleteProjectShares(job: any) {
    const { share_id } = job.data;
    await this.projectSharesService.remove(share_id);
    await this.redisService.del(`project-manager-job:${share_id}`);
  }

}
