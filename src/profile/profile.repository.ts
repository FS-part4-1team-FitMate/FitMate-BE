import { Injectable } from '@nestjs/common';
import type { Profile } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import type { CreateProfile, UpdateProfile } from '#profile/type/profile.type.js';

@Injectable()
export class ProfileRepository {
  private readonly profile;

  constructor(private readonly prisma: PrismaService) {
    this.profile = prisma.profile;
  }

  async findProfileById(id: string): Promise<Profile | null> {
    return await this.profile.findUnique({
      where: { id },
    });
  }

  async createProfile(data: CreateProfile): Promise<Profile> {
    return await this.profile.create({
      data,
    });
  }

  async updateProfile(id: string, data: UpdateProfile): Promise<Profile> {
    return await this.profile.update({
      where: { id },
      data,
    });
  }
}
