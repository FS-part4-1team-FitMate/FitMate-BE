import { Injectable, NotFoundException } from '@nestjs/common';
import type { Profile } from '@prisma/client';
import ProfileExceptionMessage from '#exception/profile-exception-message.js';
import { IProfileService } from '#profile/interface/profile.service.interface.js';
import { ProfileRepository } from '#profile/profile.repository.js';
import type { CreateProfile, UpdateProfile } from '#profile/type/profile.type.js';

@Injectable()
export class ProfileService implements IProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async createProfile(data: CreateProfile): Promise<Profile> {
    return await this.profileRepository.createProfile(data);
  }

  async findProfileById(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findProfileById(id);
    if (!profile) throw new NotFoundException(ProfileExceptionMessage.PROFILE_NOT_FOUND);
    return profile;
  }

  async updateProfile(id: string, data: UpdateProfile): Promise<Profile> {
    const profile = await this.profileRepository.findProfileById(id);
    if (!profile) throw new NotFoundException(ProfileExceptionMessage.PROFILE_NOT_FOUND);
    return await this.profileRepository.updateProfile(id, data);
  }
}
