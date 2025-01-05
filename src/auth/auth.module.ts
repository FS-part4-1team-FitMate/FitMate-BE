import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '#prisma/prisma.module.js';
import { AuthController } from '#auth/auth.controller.js';
import { AuthService } from '#auth/auth.service.js';
import { LocalStrategy } from '#auth/strategy/local.strategy.js';
import { RefreshTokenStrategy } from '#auth/strategy/refresh-token.strategy.js';
import { UserRepository } from '#user/user.repository.js';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserRepository,
    PassportModule.register({ defaultStrategy: 'local' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, RefreshTokenStrategy],
  exports: [],
})
export class AuthModule {}
