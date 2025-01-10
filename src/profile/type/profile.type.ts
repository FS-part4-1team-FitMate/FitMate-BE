import { Gender, LessonType, Region, Role } from '@prisma/client';

export interface CreateProfile {
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
