import { PartialType } from '@nestjs/mapped-types';
import { Gender, LessonRequestStatus, LessonSubType, LessonType, LocationType, Region } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsEnum(LessonType, { message: '유효하지 않은 레슨 타입입니다.' })
  lessonType: LessonType;

  @IsOptional()
  @IsEnum(LessonSubType, { message: '유효하지 않은 레슨 서브타입입니다.' })
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
  @IsEnum(LocationType, { message: '유효하지 않은 위치 타입입니다.' })
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
  @IsEnum(LessonType, { each: true, message: '유효하지 않은 레슨 타입입니다.' })
  lesson_type?: LessonType[];

  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(LessonSubType, { each: true, message: '유효하지 않은 레슨 서브타입입니다.' })
  lesson_sub_type?: LessonSubType[];

  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(LocationType, { each: true, message: '유효하지 않은 위치 타입입니다.' })
  location_type?: LocationType[];

  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(LessonRequestStatus, { each: true, message: '유효하지 않은 요청 상태값입니다.' })
  status?: LessonRequestStatus[];

  @IsOptional()
  @IsString()
  @IsIn(['created_at', 'start_date', 'end_date', 'quote_end_date', 'rating', 'lesson_count', 'lesson_time'])
  order?: string = 'created_at';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sort?: string = 'desc';

  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(Gender, { each: true, message: '유효하지 않은 성별입니다.' })
  gender?: Gender;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'false')
  direct_quote_request?: boolean;

  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(Region, { each: true, message: '유효하지 않은 지역입니다.' })
  region?: Region[];

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
      gender: this.gender,
      directQuoteRequest: this.direct_quote_request,
      region: this.region,
    };
  }
}
