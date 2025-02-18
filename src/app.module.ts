import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '#prisma/prisma.module.js';
import { AlsMiddleware } from '#common/als/als.middleware.js';
import { AlsModule } from '#common/als/als.module.js';
import { AuthModule } from '#auth/auth.module.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { EmailModule } from '#email/email.module.js';
import { UserModule } from '#user/user.module.js';
import { ProfileModule } from '#profile/profile.module.js';
import { LessonModule } from '#lesson/lesson.module.js';
import { TrainerModule } from '#trainer/trainer.module.js';
import { QuoteModule } from '#quote/quote.module.js';
import { ReviewModule } from '#review/review.module.js';
import { CacheModule } from '#cache/cache.module.js';
import { MqModule } from '#mq/mq.module.js';
import { ChatModule } from './chat/chat.module.js';
import { NotificationModule } from './notification/notification.module.js';
import { ChatbotModule } from './chatbot/chatbot.module.js';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AlsModule,
    AuthModule,
    UserModule,
    ProfileModule,
    LessonModule,
    QuoteModule,
    TrainerModule,
    ReviewModule,
    ScheduleModule.forRoot(),
    CacheModule,
    EmailModule,
    MqModule,
    NotificationModule,
    ChatModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    ChatbotModule,
  ],
  controllers: [],
  providers: [AccessTokenGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AlsMiddleware).forRoutes('*');
  }
}
