import { PartialType } from '@nestjs/mapped-types';
import { Gender, LessonType, Region, Role } from '@prisma/client';
import { IsString, IsOptional, IsArray, IsEnum, IsInt, IsNotEmpty, IsIn } from 'class-validator';
import { RoleFieldValidator } from '#profile/decorator/role-field-validator.js';

export class CreateProfileDTO {
  @IsNotEmpty()
  @IsString()
  @IsEnum(Role)
  role: Role; //서버에서만 사용

  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsNotEmpty()
  @IsIn([0, 1], { message: 'profileImageCount를 입력해야합니다' })
  profileImageCount: number;

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

  @RoleFieldValidator('TRAINER', { message: '한 줄 소개를 작성해야 합니다.' })
  intro: string;

  @RoleFieldValidator('TRAINER', { message: '상세 설명을 작성해야 합니다.' })
  description: string;

  @RoleFieldValidator(
    'TRAINER',
    { message: '경력을 등록해야 합니다.' },
    (value: any) => typeof value === 'number' && Number.isInteger(value) && value >= 0,
  )
  experience: number;

  @IsInt()
  @IsNotEmpty()
  @IsIn([0, 1], { message: 'certificationCount를 입력해야합니다' })
  certificationCount: number;

  @IsString()
  @IsOptional()
  certification?: string;
}

export class UpdateProfileDTO extends PartialType(CreateProfileDTO) {}
