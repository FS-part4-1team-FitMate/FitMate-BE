import { PartialType } from '@nestjs/mapped-types';
import { Gender, LessonType, Region, Role } from '@prisma/client';
import { IsString, IsOptional, IsArray, IsEnum, IsInt, Min, IsNotEmpty } from 'class-validator';
import { RoleFieldValidator } from '#profile/decorator/role-field-validator.js';

export class CreateProfileDTO {
  @IsNotEmpty()
  @IsString()
  @IsEnum(Role)
  role: Role; //서버에서만 사용

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsArray()
  @IsNotEmpty()
  @IsEnum(LessonType, { each: true })
  lessonType: LessonType[];

  @IsArray()
  @IsNotEmpty()
  @IsEnum(Region, { each: true })
  region: Region[];

  // @IsOptional()
  @RoleFieldValidator('TRAINER', { message: 'intro를 작성해야 합니다.' })
  intro: string;

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
