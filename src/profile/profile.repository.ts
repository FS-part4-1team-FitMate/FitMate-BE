import { Injectable } from '@nestjs/common';
import type { Profile } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import { IProfileRepository } from '#profile/interface/profile.repository.interface.js';
import type { ExclusionCountProfile, UpdateProfile } from '#profile/type/profile.type.js';

@Injectable()
export class ProfileRepository implements IProfileRepository {
  private readonly profile;

  constructor(private readonly prisma: PrismaService) {
    this.profile = prisma.profile;
  }

  async findProfileById(userId: string): Promise<Profile | null> {
    return await this.profile.findUnique({
      where: { userId },
    });
  }

  async createProfile(userId: string, data: ExclusionCountProfile): Promise<Profile> {
    return await this.profile.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async updateProfile(userId: string, data: UpdateProfile): Promise<Profile> {
    return await this.profile.update({
      where: { userId },
      data,
    });
  }
}
