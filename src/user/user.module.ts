import { Module } from '@nestjs/common';
import { PrismaModule } from '#prisma/prisma.module.js';
import { AlsModule } from '#common/als/als.module.js';
import { AuthModule } from '#auth/auth.module.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { UserController } from '#user/user.controller.js';
import { UserRepository } from '#user/user.repository.js';
import { UserService } from '#user/user.service.js';

@Module({
  imports: [PrismaModule, AuthModule, AlsModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, AccessTokenGuard],
  exports: [UserRepository],
})
export class UserModule {}
