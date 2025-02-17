import { Module } from '@nestjs/common';
import { PrismaModule } from '#prisma/prisma.module.js';
import { AlsModule } from '#common/als/als.module.js';
import { AuthModule } from '#auth/auth.module.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { UserRepository } from '#user/user.repository.js';
import { ProfileController } from '#profile/profile.controller.js';
import { ProfileRepository } from '#profile/profile.repository.js';
import { ProfileService } from '#profile/profile.service.js';
import { S3Module } from '#s3/s3.module.js';

@Module({
  imports: [PrismaModule, AlsModule, AuthModule, S3Module],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository, UserRepository, AccessTokenGuard],
  exports: [ProfileService, ProfileRepository],
})
export class ProfileModule {}
