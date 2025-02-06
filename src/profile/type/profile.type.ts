import { Gender, LessonType, Region, Role, Profile } from '@prisma/client';

export type ContentType = 'image/jpg' | 'image/jpeg' | 'image/png' | 'image/webp';
export interface CreateProfile {
  name?: string;
  contentType?: ContentType;
  profileImageCount: number;
  profileImage?: string;
  phone?: string;
  gender: Gender;
  lessonType: LessonType[];
  region: Region[];
  intro?: string;
  description?: string;
  experience?: number;
  certificationCount: number;
  certification?: string;
}

export interface ExclusionCountProfile {
  name?: string;
  profileImage?: string;
  phone?: string;
  gender: Gender;
  lessonType: LessonType[];
  region: Region[];
  intro?: string;
  description?: string;
  experience?: number;
  certification?: string;
}

export interface UpdateProfile extends Partial<CreateProfile> {}

export interface UserRole {
  role: Role;
}

export type ExclusionImageProfile = Omit<Profile, 'profileImage'>;

export interface CustomProfile {
  profile: Profile;
  profileImagePresignedUrl?: string;
  certificationPresignedUrl?: string;
}
