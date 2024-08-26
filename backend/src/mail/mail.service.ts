import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Users } from '@users/user.entity';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

interface UserEmail extends Users {
  url: string;
}
@Processor('mailer')
@Injectable()
export class MailService extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super(); // must call super

  }

  async process(job: Job<UserEmail, any, string>): Promise<any> {
    const environ = process.env.NODE_ENV;
    const endpoint = {
      development: 'http://localhost:3000/auth/verify',
      production: 'https://collabor8.netlify.app/auth/verify',
      signinDev: 'http://localhost:3000/auth/signin',
      signinProd: 'https://collabor8.netlify.app/auth/signin',
    };
    const url = `${endpoint[environ] ?? endpoint.development}?token=${job.data.user_id}`;
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
            url: job.data.url,
          },
        });
      }
      default: {
        console.log('-------Unregister job-------->');
      }
    }
  }
}
