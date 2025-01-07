import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '#prisma/prisma.module.js';
import { UserModule } from '#user/user.module.js';
import { LessonModule } from './lesson/lesson.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UserModule,
    LessonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
