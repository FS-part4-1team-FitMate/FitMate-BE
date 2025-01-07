import { LessonSubType, LessonType, LocationType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsEnum(LessonType)
  lessonType: LessonType;

  @IsOptional()
  @IsEnum(LessonSubType)
  lessonSubType?: LessonSubType;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate: Date;

  @IsInt()
  lessonCount: number;

  @IsInt()
  lessonTime: number;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  quoteEndDate: Date;

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
