import { PartialType } from '@nestjs/mapped-types';
import { LessonSubType, LessonType, LocationType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsEnum(LessonType)
  lessonType: LessonType;

  @IsOptional()
  @IsEnum(LessonSubType)
  lessonSubType?: LessonSubType;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate: Date;

  @IsNotEmpty()
  @IsInt()
  lessonCount: number;

  @IsNotEmpty()
  @IsInt()
  lessonTime: number;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  quoteEndDate: Date;

  @IsNotEmpty()
  @IsEnum(LocationType)
  locationType: LocationType;

  @IsOptional()
  @IsString()
  postcode?: string;

  @IsOptional()
  @IsString()
  roadAddress?: string;

  @IsOptional()
  @IsString()
  detailAddress?: string;
}

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}
