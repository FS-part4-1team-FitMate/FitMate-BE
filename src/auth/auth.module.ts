import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '#prisma/prisma.module.js';
import { JwtConfigModule } from '#common/jwt.module.js';
import { AuthController } from '#auth/auth.controller.js';
import { AuthService } from '#auth/auth.service.js';
import { KakaoStrategy } from '#auth/strategy/kakao.strategy.js';
import { LocalStrategy } from '#auth/strategy/local.strategy.js';
import { NaverStrategy } from '#auth/strategy/naver.strategy.js';
import { RefreshTokenStrategy } from '#auth/strategy/refresh-token.strategy.js';
import { EmailModule } from '#email/email.module.js';
import { UserRepository } from '#user/user.repository.js';
import { ProfileRepository } from '#profile/profile.repository.js';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    JwtConfigModule,
    HttpModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    RefreshTokenStrategy,
    UserRepository,
    ProfileRepository,
    NaverStrategy,
    KakaoStrategy,
  ],
  exports: [],
})
export class AuthModule {}
