import { PartialType } from '@nestjs/mapped-types';
import { Gender, LessonType, Region } from '@prisma/client';
import { IsString, IsOptional, IsArray, IsEnum, IsInt, Min } from 'class-validator';
import { RoleFieldValidator } from '#profile/decorator/role-field-validator.js';

export class CreateProfileDTO {
  @IsString()
  @IsOptional()
  role?: string; //서버에서만 사용

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsArray()
  @IsEnum(LessonType, { each: true })
  lessonType: LessonType[];

  @IsArray()
  @IsEnum(Region, { each: true })
  region: Region[];

  @IsString()
  @IsOptional()
  @RoleFieldValidator('TRAINER', { message: 'intro를 작성해야 합니다.' })
  intro?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  experience?: number;

  @IsString()
  @IsOptional()
  certification?: string;
}

export class UpdateProfileDTO extends PartialType(CreateProfileDTO) {}
