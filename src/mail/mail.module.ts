import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter.js';
import { join } from 'path';
import { MailProcessor } from '#mail/mail.processor.js';
import { MailService } from '#mail/mail.service.js';
import { CacheConfigModule } from '#cache/cache.config.module.js';
import { SEND_MAIL } from '#mq/queue.constants.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: Number(configService.get<string>('SMTP_PORT')),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: configService.get<string>('SMTP_FROM'),
        },
        template: {
          dir: join(process.cwd(), 'src', 'mail', 'templates'),
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    CacheConfigModule,
    BullModule.registerQueueAsync({
      name: SEND_MAIL,
      imports: [CacheConfigModule],
      inject: ['BULL_REDIS'],
      useFactory: (redisOptions) => ({
        connection: redisOptions,
      }),
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
