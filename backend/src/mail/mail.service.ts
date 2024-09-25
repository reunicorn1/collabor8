import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('mailer')
@Injectable()
export class MailService extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super(); // must call super
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const env = {
      development: `${process.env.URL_DEV}`,
      production: `${process.env.URL_PROD}`,
      /*
      signinDev: 'http://localhost:3000/auth/signin'|| process.env,
      signinProd: 'https://collabor8.netlify.app/auth/signin',
      */
    };
    const url = `${env[process.env.NODE_ENV]}/verify?token=${job.data.user_id}`;
    switch (job.name) {
      case 'verification': {
        return await this.mailerService.sendMail({
          to: job.data.email,
          from: '"Support Team" <support@collabor8.com>', // override default from
          subject: 'Welcome to Collabor8! Confirm your Email',
          template: './confirmation', // `.hbs` extension is appended automatically
          context: {
            name: job.data.username,
            url,
          },
        });
      }
      case 'reset-password': {
        return await this.mailerService.sendMail({
          to: job.data.email,
          from: '"Support Team" <support@collabor8.com>', // override default from
          subject: 'Password Reset Request',
          template: './reset-password', // `.hbs` extension is appended automatically
          context: {
            name: job.data.username,
            url: `${job.data.url}`,
          },
        });
      }
      case 'invitation': {
        // { invitee_email, project_id }
        const project_id = job.data.project_id;
        const invitee_email = job.data.invitee_email;
        const inviter_email = job.data.inviter_email;
        const access_level = job.data.access_level;
        const has_account = job.data.has_account;
        const _id = job.data._id;
        const url = `${env[process.env.NODE_ENV]}/invite?`.concat(
          `project_id=${project_id}&`,
          `access_level=${access_level}&`,
          `invitee_email=${invitee_email}&`,
          `inviter_email=${inviter_email}&`,
          `has_account=${has_account}&`,
          `_id=${_id}`,
        );
        return await this.mailerService.sendMail({
          to: job.data.invitee_email,
          from: '"Support Team" <support@collabor8.com>', // override default from
          subject: "Let's collaborate!",
          template: './invitation', // `.hbs` extension is appended automatically
          context: {
            project_id: job.data.project_id,
            invitee_email: job.data.invitee_email,
            inviter_email: job.data.inviter_email,
            url,
          },
        });
      }
      default: {
        Logger.warn('-------Unregister job-------->');
      }
    }
  }
}
