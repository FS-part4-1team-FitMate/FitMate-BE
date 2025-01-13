import { Module } from '@nestjs/common';
import { PrismaModule } from '#prisma/prisma.module.js';
import { AlsModule } from '#common/als/als.module.js';
import { AuthModule } from '#auth/auth.module.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { ProfileController } from '#profile/profile.controller.js';
import { ProfileRepository } from '#profile/profile.repository.js';
import { ProfileService } from '#profile/profile.service.js';

@Module({
  imports: [PrismaModule, AlsModule, AuthModule],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository, AccessTokenGuard],
})
export class ProfileModule {}
