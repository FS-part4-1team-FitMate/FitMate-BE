import { PartialType } from '@nestjs/mapped-types';
import { Gender, LessonType, Region } from '@prisma/client';

export class CreateProfile {
  userId: string;
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

export class UpdateProfile extends PartialType(CreateProfile) {}
