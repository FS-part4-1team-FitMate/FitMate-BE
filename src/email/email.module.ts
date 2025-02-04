import { Module } from '@nestjs/common';
import { EmailService } from '#email/email.service.js';
import { MailModule } from '#mail/mail.module.js';
import { CacheModule } from '#cache/cache.module.js';

@Module({
  imports: [CacheModule, MailModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
