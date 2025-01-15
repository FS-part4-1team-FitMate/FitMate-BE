import {
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { AlsStore } from '#common/als/store-validator.js';
import ExceptionMessages from '#exception/exception-message.js';
import ProfileExceptionMessage from '#exception/profile-exception-message.js';
import { IProfileService } from '#profile/interface/profile.service.interface.js';
import { ProfileRepository } from '#profile/profile.repository.js';
import type { CreateProfile, CustomProfile, UpdateProfile } from '#profile/type/profile.type.js';
import { ContentType } from '#profile/type/profile.type.js';
import { S3Service } from '#s3/s3.service.js';

@Injectable()
export class ProfileService implements IProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly alsStore: AlsStore,
    private readonly s3Service: S3Service,
  ) {}

  async createProfile(data: CreateProfile): Promise<CustomProfile> {
    const { userId, userRole } = await this.alsStore.getStore();

    const profile = await this.profileRepository.findProfileById(userId);
    if (profile) throw new ConflictException(ProfileExceptionMessage.PROFILE_CONFLICT);

    const { profileImageCount, certificationCount, contentType, ...restData } = data;

    const profileImage = await this.createImage(
      userId,
      profileImageCount,
      'profile-default.jpg',
      'profile',
      profileImageCount === 0 ? undefined : contentType,
    );
    restData.profileImage = profileImage.s3Key;

    let certificationImage;
    if (userRole !== 'USER') {
      certificationImage = await this.createImage(
        userId,
        certificationCount,
        'img-default.jpg',
        'certification',
        certificationCount === 0 ? undefined : contentType,
      );
      restData.certification = certificationImage.s3Key;
    }

    const createProfile = await this.profileRepository.createProfile(userId, restData);
    return {
      profile: createProfile,
      profileImagePresignedUrl: profileImage.presignedUrl,
      certificationPresignedUrl: certificationImage?.presignedUrl,
    };
  }

  async findProfileById(id: string): Promise<CustomProfile> {
    const profile = await this.profileRepository.findProfileById(id);
    if (!profile) throw new NotFoundException(ProfileExceptionMessage.PROFILE_NOT_FOUND);
    let profileImagePresignedUrl;
    let certificationPresignedUrl;

    if (profile.profileImage) {
      profileImagePresignedUrl = await this.s3Service.getPresignedDownloadUrl(profile.profileImage);
    }

    if (profile.certification) {
      certificationPresignedUrl = await this.s3Service.getPresignedDownloadUrl(profile.certification);
    }

    return {
      profile: profile,
      profileImagePresignedUrl: profileImagePresignedUrl,
      certificationPresignedUrl: certificationPresignedUrl,
    };
  }

  async updateProfile(id: string, data: UpdateProfile): Promise<CustomProfile> {
    const profile = await this.profileRepository.findProfileById(id);
    if (!profile) throw new NotFoundException(ProfileExceptionMessage.PROFILE_NOT_FOUND);

    const { userId } = await this.alsStore.getStore();
    if (id !== userId) throw new ForbiddenException(ExceptionMessages.FORBIDDEN);

    const { profileImageCount, certificationCount, contentType, ...restData } = data;
    let profileImagePresignedUrl;
    let certificationPresignedUrl;

    if (profileImageCount === 1) {
      if (!contentType) throw new Error(ProfileExceptionMessage.CONTENT_TYPE_REQUIRED);
      if (profile.profileImage === 'profile-default.jpg') {
        const newProfileImage = await this.createImage(
          userId,
          profileImageCount,
          'profile-default.jpg',
          'profile',
          contentType,
        );
        restData.profileImage = newProfileImage.s3Key;
        profileImagePresignedUrl = newProfileImage.presignedUrl;
      } else {
        if (!profile.profileImage) throw new Error(ProfileExceptionMessage.PROFILE_IMAGE_NOT_FOUND);
        profileImagePresignedUrl = await this.s3Service.generatePresignedUrl(
          profile.profileImage,
          contentType,
        );
      }
    }

    if (certificationCount === 1) {
      if (!contentType) throw new Error(ProfileExceptionMessage.CONTENT_TYPE_REQUIRED);
      if (profile.certification === 'img_default.jpg') {
        const newCertificationImage = await this.createImage(
          userId,
          certificationCount,
          'img_default.jpg',
          'certification',
          contentType,
        );
        restData.certification = newCertificationImage.s3Key;
        certificationPresignedUrl = newCertificationImage.presignedUrl;
      } else {
        if (!profile.certification) throw new Error(ProfileExceptionMessage.CERTIFICATION_NOT_FOUND);
        certificationPresignedUrl = await this.s3Service.generatePresignedUrl(
          profile.certification,
          contentType,
        );
      }
    }

    const updateProfile = await this.profileRepository.updateProfile(id, restData);
    return {
      profile: updateProfile,
      profileImagePresignedUrl: profileImagePresignedUrl,
      certificationPresignedUrl: certificationPresignedUrl,
    };
  }

  async createImage(
    userId: string,
    count: number,
    defaultKey: string,
    folder: 'profile' | 'certification',
    contentType?: ContentType,
  ): Promise<{ s3Key: string; presignedUrl?: string }> {
    const fileExtensionMap = {
      'image/jpg': 'jpg',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };

    if (count === 0) {
      return { s3Key: defaultKey };
    }

    if (!contentType) {
      throw new BadRequestException(ProfileExceptionMessage.CONTENT_TYPE_REQUIRED);
    }

    const fileExtension = fileExtensionMap[contentType];

    const s3Key = `${folder}/${userId}/${Date.now()}.${fileExtension}`;
    const presignedUrl = await this.s3Service.generatePresignedUrl(s3Key, contentType);
    return { s3Key, presignedUrl };
  }
}
