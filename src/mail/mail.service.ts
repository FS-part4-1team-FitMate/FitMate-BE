import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { SEND_MAIL } from '#mq/queue.constants.js';

@Injectable()
export class MailService {
  constructor(@InjectQueue(SEND_MAIL) private readonly mailQueue: Queue) {}

  async queueEmail(email: string, code: string) {
    //추후 삭제
    console.log(`queue에 작업 추가: ${email}`);
    await this.mailQueue.add('send-email', { email, code });
  }
}
