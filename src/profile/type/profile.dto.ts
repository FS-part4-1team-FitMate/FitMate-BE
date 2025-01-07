import { PartialType } from '@nestjs/mapped-types';
import { Gender, LessonType, Region } from '@prisma/client';
import { IsString, IsOptional, IsNotEmpty, IsArray, IsEnum, IsInt, Min } from 'class-validator';

export class CreateProfileDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;
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
