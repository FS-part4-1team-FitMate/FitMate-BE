import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '#prisma/prisma.module.js';
import { AuthController } from '#auth/auth.controller.js';
import { AuthService } from '#auth/auth.service.js';
import { UserRepository } from '#user/user.repository.js';
import { LocalStrategy } from './guard/local.strategy.js';

@Module({
  imports: [PrismaModule, ConfigModule, UserRepository, PassportModule.register({ defaultStrategy: 'local' })],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [],
})
export class AuthModule {}
