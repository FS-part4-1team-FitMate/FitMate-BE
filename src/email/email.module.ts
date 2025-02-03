import { Module } from '@nestjs/common';
import { EmailService } from '#email/email.service.js';
import { CacheModule } from '#cache/cache.module.js';

@Module({
  imports: [CacheModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
