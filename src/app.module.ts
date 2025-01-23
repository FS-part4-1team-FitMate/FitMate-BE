import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '#prisma/prisma.module.js';
import { AlsMiddleware } from '#common/als/als.middleware.js';
import { AlsModule } from '#common/als/als.module.js';
import { AuthModule } from '#auth/auth.module.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { UserModule } from '#user/user.module.js';
import { ProfileModule } from '#profile/profile.module.js';
import { ReviewModule } from '#review/review.module.js';
import { LessonModule } from './lesson/lesson.module.js';
import { QuoteModule } from './quote/quote.module.js';
import { TrainerModule } from './trainer/trainer.module.js';

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
  ],
  controllers: [],
  providers: [AccessTokenGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AlsMiddleware).forRoutes('*');
  }
}
