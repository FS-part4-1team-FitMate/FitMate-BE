import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { Profile } from '@prisma/client';
import { AlsStore } from '#common/als/store-validator.js';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import ExceptionMessages from '#exception/exception-message.js';
import ProfileExceptionMessage from '#exception/profile-exception-message.js';
import { UserRepository } from '#user/user.repository.js';
import { IProfileService } from '#profile/interface/profile.service.interface.js';
import { ProfileRepository } from '#profile/profile.repository.js';
import type { CreateProfile, UpdateProfile } from '#profile/type/profile.type.js';

@Injectable()
export class ProfileService implements IProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly UserRepository: UserRepository,
    private readonly alsStore: AlsStore,
  ) {}

  async createProfile(data: CreateProfile): Promise<Profile> {
    const { userId, userRole } = await this.alsStore.getStore();
    console.log('Stored userRole:', userRole);

    const profile = await this.profileRepository.findProfileById(userId);
    if (profile) throw new ConflictException(ProfileExceptionMessage.PROFILE_CONFLICT);

    return await this.profileRepository.createProfile(userId, data);
  }

  async findProfileById(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findProfileById(id);
    console.log(profile);
    if (!profile) throw new NotFoundException(ProfileExceptionMessage.PROFILE_NOT_FOUND);

    return profile;
  }

  async updateProfile(id: string, data: UpdateProfile): Promise<Profile> {
    const profile = await this.profileRepository.findProfileById(id);
    if (!profile) throw new NotFoundException(ProfileExceptionMessage.PROFILE_NOT_FOUND);

    const { userId } = await this.alsStore.getStore();
    console.log('Provided ID:', id);
    console.log('Stored userId:', userId);
    if (id !== userId) throw new ForbiddenException(ExceptionMessages.FORBIDDEN);

    return await this.profileRepository.updateProfile(id, data);
  }
}
