import { PartialType } from '@nestjs/mapped-types';
import { LessonRequestStatus, LessonSubType, LessonType, LocationType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

export class QueryLessonDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? Number(value) : 1))
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? Number(value) : 10))
  limit?: number;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(LessonType, { each: true })
  lesson_type?: LessonType[];

  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(LessonSubType, { each: true })
  lesson_sub_type?: LessonSubType[];

  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(LocationType, { each: true })
  location_type?: LocationType[];

  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(LessonRequestStatus, { each: true })
  status?: LessonRequestStatus[];

  @IsOptional()
  @IsString()
  @IsIn(['created_at', 'start_date', 'end_date', 'quote_end_date', 'rating', 'lesson_count', 'lesson_time'])
  order?: string = 'created_at';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sort?: string = 'desc';

  // CamelCase 변환 메서드
  toCamelCase() {
    return {
      page: this.page,
      limit: this.limit,
      order: this.order,
      sort: this.sort,
      keyword: this.keyword,
      lessonType: this.lesson_type,
      lessonSubType: this.lesson_sub_type,
      locationType: this.location_type,
      status: this.status,
    };
  }
}
