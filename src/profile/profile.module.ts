import { Module } from '@nestjs/common';
import { PrismaModule } from '#prisma/prisma.module.js';
import { ProfileController } from '#profile/profile.controller.js';
import { ProfileRepository } from '#profile/profile.repository.js';
import { ProfileService } from '#profile/profile.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
})
export class ProfileModule {}
