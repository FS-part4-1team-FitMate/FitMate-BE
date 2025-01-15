import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Profile } from '@prisma/client';
import { AlsStore } from '#common/als/store-validator.js';
import ExceptionMessages from '#exception/exception-message.js';
import ProfileExceptionMessage from '#exception/profile-exception-message.js';
import { IProfileService } from '#profile/interface/profile.service.interface.js';
import { ProfileRepository } from '#profile/profile.repository.js';
import type { CreateProfile, UpdateProfile, CustomProfile } from '#profile/type/profile.type.js';
import { S3Service } from '#s3/s3.service.js';

@Injectable()
export class ProfileService implements IProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly alsStore: AlsStore,
    private readonly s3service: S3Service,
  ) {}

  async createProfile(data: CreateProfile): Promise<CustomProfile> {
    const { userId } = await this.alsStore.getStore();

    const profile = await this.profileRepository.findProfileById(userId);
    if (profile) throw new ConflictException(ProfileExceptionMessage.PROFILE_CONFLICT);

    const { profileImageCount, certificationCount, contentType, ...restData } = data;

    const profileImage = await this.handleImage(
      userId,
      profileImageCount,
      'profile-default.jpg',
      'profile',
      profileImageCount === 0 ? undefined : contentType,
    );
    restData.profileImage = profileImage.s3Key;

    const certificationImage = await this.handleImage(
      userId,
      certificationCount,
      'img_default.jpg',
      'certification',
      certificationCount === 0 ? undefined : contentType,
    );
    restData.certification = certificationImage.s3Key;

    const createProfile = await this.profileRepository.createProfile(userId, restData);
    return {
      profile: createProfile,
      profileImagePresignedUrl: profileImage.presignedUrl,
      certificationPresignedUrl: certificationImage.presignedUrl,
    };
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
    if (id !== userId) throw new ForbiddenException(ExceptionMessages.FORBIDDEN);

    return await this.profileRepository.updateProfile(id, data);
  }

  async handleImage(
    userId: string,
    count: number,
    defaultKey: string,
    folder: 'profile' | 'certification',
    contentType?: string,
  ): Promise<{ s3Key: string; presignedUrl?: string }> {
    if (count === 0) {
      return { s3Key: defaultKey };
    }

    if (!contentType) {
      throw new BadRequestException(ProfileExceptionMessage.CONTENT_TYPE_REQUIRED);
    }

    const s3Key = `${folder}/${userId}/${Date.now()}.jpg`;
    const presignedUrl = await this.s3service.generatePresignedUrl(s3Key, contentType);
    return { s3Key, presignedUrl };
  }
}
