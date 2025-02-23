import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  DirectQuoteRequestStatus,
  Gender,
  LessonRequestStatus,
  LessonSubType,
  LessonType,
  LocationType,
  Region,
} from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { UserSimpleResponseDto } from '#user/dto/user.dto.js';

export class CreateLessonDto {
  @ApiProperty({
    description: '레슨 타입 (예: SPORTS, FITNESS, REHAB)',
    enum: LessonType,
  })
  @IsNotEmpty()
  @IsEnum(LessonType, { message: '유효하지 않은 레슨 타입입니다.' })
  lessonType: LessonType;

  @ApiPropertyOptional({
    description: '레슨 서브타입 (예: YOGA, PILATES, SWIMMING)',
    enum: LessonSubType,
  })
  @IsOptional()
  @IsEnum(LessonSubType, { message: '유효하지 않은 레슨 서브타입입니다.' })
  lessonSubType?: LessonSubType;

  @ApiProperty({
    description: '레슨 시작날짜/시간',
  })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: '레슨 종료 날짜/시간',
  })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate: Date;

  @ApiProperty({
    description: '레슨 총 횟수',
  })
  @IsNotEmpty()
  @IsInt()
  lessonCount: number;

  @ApiProperty({
    description: '레슨 총 시간',
  })
  @IsNotEmpty()
  @IsInt()
  lessonTime: number;

  @ApiProperty({
    description: '장소 유형 (예: ONLINE, OFFLINE)',
    enum: LocationType,
  })
  @IsNotEmpty()
  @IsEnum(LocationType, { message: '유효하지 않은 장소 유형입니다.' })
  locationType: LocationType;

  @ApiPropertyOptional({ description: '우편번호', example: '12345' })
  @IsOptional()
  @IsString()
  postcode?: string;

  @ApiPropertyOptional({ description: '도로명주소', example: '서울특별시 강남구 역삼동 ...' })
  @IsOptional()
  @IsString()
  roadAddress?: string;

  @ApiPropertyOptional({ description: '상세주소', example: '101동 101호' })
  @IsOptional()
  @IsString()
  detailAddress?: string;
}

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}

export class QueryLessonDto {
  @ApiPropertyOptional({
    description: '페이지 번호 (기본: 1)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1, { message: '페이지 번호는 1 이상의 정수여야 합니다.' })
  @Transform(({ value }) => (value ? Number(value) : 1))
  page?: number;

  @ApiPropertyOptional({
    description: '페이지 당 레슨 개수 (기본: 5)',
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1, { message: '페이지당 레슨 개수(limit)는 1 이상의 정수여야 합니다.' })
  @Transform(({ value }) => (value ? Number(value) : 5))
  limit?: number;

  @ApiPropertyOptional({
    description: '검색 키워드 (닉네임, 트레이너명 등)',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    description: '레슨 타입 (콤마로 구분). 예: "SPORTS,FITNESS"',
    enum: LessonType,
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(LessonType, { each: true, message: '유효하지 않은 레슨 타입입니다.' })
  lesson_type?: LessonType[];

  @ApiPropertyOptional({
    description: '레슨 서브타입(콤마 구분). (예: "PILATES,YOGA")',
    enum: LessonSubType,
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(LessonSubType, { each: true, message: '유효하지 않은 레슨 서브타입입니다.' })
  lesson_sub_type?: LessonSubType[];

  @ApiPropertyOptional({
    description: '장소 유형(콤마 구분) (예: OFFLINE, ONLINE)',
    enum: LocationType,
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(LocationType, { each: true, message: '유효하지 않은 장소 유형입니다.' })
  location_type?: LocationType[];

  @ApiPropertyOptional({
    description: '레슨 상태(콤마 구분). 예: "PENDING,QUOTE_CONFIRMED"',
    enum: LessonRequestStatus,
    isArray: true,
  })
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

  @ApiPropertyOptional({
    description: '성별(콤마 구분). 예: "MALE,FEMALE"',
    enum: Gender,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(Gender, { each: true, message: '유효하지 않은 성별입니다.' })
  gender?: Gender[];

  @ApiPropertyOptional({
    description: '지역(콤마 구분). 예: "SEOUL,GYEONGGI"',
    enum: Region,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(Region, { each: true, message: '유효하지 않은 지역입니다.' })
  region?: Region[];

  @ApiPropertyOptional({
    description: '지정 견적 요청 여부 (true 또는 false)',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'has_direct_quote는 true 또는 false 값이어야 합니다.' })
  has_direct_quote?: boolean;

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
      hasDirectQuote: this.has_direct_quote,
      region: this.region,
    };
  }
}

export class CreateDirectQuoteDto {
  @ApiProperty({ description: '견적을 요청할 트레이너의 UUID' })
  @IsNotEmpty()
  @IsUUID('4', { message: '유효하지 않은 강사 ID입니다.' })
  trainerId: string;
}

export class RejectDirectQuoteDto {
  @ApiPropertyOptional({ description: '반려 사유' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class DirectQuoteRequestResponseDto {
  @ApiProperty({ description: '지정 견적 요청 ID' })
  id: string;

  @ApiProperty({ description: '레슨 요청 ID' })
  lessonRequestId: string;

  @ApiProperty({ description: '트레이너 ID' })
  trainerId: string;

  @ApiProperty({ description: '견적 상태', enum: DirectQuoteRequestStatus })
  status: DirectQuoteRequestStatus;

  @ApiPropertyOptional({ description: '반려 사유' })
  rejectionReason?: string;

  @ApiProperty({ description: '생성 일자' })
  createdAt: string;

  @ApiProperty({ description: '수정 일자' })
  updatedAt: string;
}

export class RejectedDirectQuoteRequestResponseDto {
  @ApiProperty({ description: '지정 견적 요청 ID' })
  id: string;

  @ApiProperty({ description: '레슨 요청 ID' })
  lessonRequestId: string;

  @ApiProperty({ description: '트레이너 ID' })
  trainerId: string;

  @ApiProperty({ description: '견적 상태', enum: DirectQuoteRequestStatus, example: 'REJECTED' })
  status: DirectQuoteRequestStatus;

  @ApiProperty({ description: '반려 사유' })
  rejectionReason: string;

  @ApiProperty({ description: '생성 일자' })
  createdAt: string;

  @ApiProperty({ description: '수정 일자' })
  updatedAt: string;
}

export class LessonResponseDto {
  @ApiProperty({ description: '레슨 ID' })
  id: string;

  @ApiProperty({ description: '레슨 타입', enum: LessonType })
  lessonType: LessonType;

  @ApiPropertyOptional({ description: '레슨 서브타입', enum: LessonSubType })
  lessonSubType?: LessonSubType;

  @ApiProperty({ description: '레슨 시작 날짜/시간' })
  startDate: string;

  @ApiProperty({ description: '레슨 종료 날짜/시간' })
  endDate: string;

  @ApiProperty({ description: '레슨 총 횟수' })
  lessonCount: number;

  @ApiProperty({ description: '레슨 총 시간' })
  lessonTime: number;

  @ApiProperty({ description: '견적 마감일' })
  quoteEndDate: string;

  @ApiProperty({ description: '장소 유형', enum: LocationType })
  locationType: LocationType;

  @ApiPropertyOptional({ description: '우편번호' })
  postcode?: string;

  @ApiPropertyOptional({ description: '도로명 주소' })
  roadAddress?: string;

  @ApiPropertyOptional({ description: '상세 주소' })
  detailAddress?: string;

  @ApiProperty({ description: '레슨 상태', enum: LessonRequestStatus })
  status: LessonRequestStatus;

  @ApiProperty({ description: '생성 일자' })
  createdAt: string;

  @ApiProperty({ description: '수정 일자' })
  updatedAt: string;

  @ApiProperty({ description: '지정 견적 요청 목록', type: [DirectQuoteRequestResponseDto] })
  directQuoteRequests: DirectQuoteRequestResponseDto[];

  @ApiProperty({ description: '사용자 정보', type: UserSimpleResponseDto })
  user: UserSimpleResponseDto;

  @ApiProperty({ description: '지정 견적 여부' })
  isDirectQuote: boolean;
}

export class LessonListResponseDto {
  @ApiProperty({ description: '레슨 목록', type: [LessonResponseDto] })
  list: LessonResponseDto[];

  @ApiProperty({ description: '총 개수' })
  totalCount: number;

  @ApiProperty({ description: '다음 페이지 여부' })
  hasMore: boolean;
}

export class MyLessonListResponseDto extends LessonListResponseDto {
  @ApiProperty({ description: '레슨 타입별 개수', type: Object })
  lessonTypeCounts: Record<string, number>;

  @ApiProperty({ description: '성별 개수', type: Object })
  genderCounts: Record<string, number>;

  @ApiProperty({ description: '지정 견적 요청 개수' })
  directQuoteRequestCount: number;
}
