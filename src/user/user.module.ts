import { Module } from '@nestjs/common';
import { PrismaModule } from '#prisma/prisma.module.js';
import { UserController } from '#user/user.controller.js';
import { UserRepository } from '#user/user.repository.js';
import { UserService } from '#user/user.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
