import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Injectable, Inject } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bullmq';
import { SEND_MAIL } from '#mq/queue.constants.js';

@Processor(SEND_MAIL)
@Injectable()
export class MailProcessor extends WorkerHost {
  constructor(
    @Inject('BULL_REDIS') private readonly redisConfig: any,
    private readonly mailerService: MailerService,
  ) {
    super();
  }

  async process(job: Job<{ email: string; code: string }>): Promise<void> {
    const { email, code } = job.data;

    await this.mailerService.sendMail({
      to: email,
      subject: 'fitmate 이메일 인증 코드',
      template: './verificationEmail',
      context: { code },
    });

    //추후 삭제
    console.log(`bullMq 이메일 전송 완료: ${email}`);
  }
}
