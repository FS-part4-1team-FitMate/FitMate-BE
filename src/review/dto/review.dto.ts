import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsInt, Min, Max, IsUUID, IsString, Length, IsOptional } from 'class-validator';
import { UserSimpleResponseDto } from '#user/dto/user.dto.js';
import { LessonQuoteResponse } from '#quote/type/quote.type.js';

export class CreateReviewDto {
  @ApiProperty({ description: '레슨 견적 ID' })
  @IsNotEmpty()
  @IsUUID('4', { message: '유효하지 않은 견적 ID입니다.' })
  lessonQuoteId: string;

  @ApiProperty({ description: '평점 (1~5)', minimum: 1, maximum: 5 })
  @IsNotEmpty()
  @IsInt({ message: '평점은 숫자여야 합니다.' })
  @Min(1, { message: '평점은 최소 1점 이상이어야 합니다.' })
  @Max(5, { message: '평점은 최대 5점 이하이어야 합니다.' })
  rating: number;

  @ApiProperty({ description: '리뷰 내용', minLength: 5, maxLength: 500 })
  @IsString()
  @Length(5, 500, { message: '리뷰 내용은 최소 5자에서 최대 500자까지 입력 가능합니다.' })
  content: string;
}

export class GetReviewsQueryDto {
  @IsOptional()
  @IsUUID('4', { message: '유효하지 않은 트레이너 ID입니다.' })
  trainer_id?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1, { message: '페이지는 최소 1 이상이어야 합니다.' })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1, { message: '리밋은 최소 1 이상이어야 합니다.' })
  limit?: number;
}

export class GetMyReviewsQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1, { message: '페이지는 최소 1 이상이어야 합니다.' })
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1, { message: '리밋은 최소 1 이상이어야 합니다.' })
  limit?: number;
}

export class ReviewSimpleResponseDto {
  @ApiProperty({ description: '리뷰 ID' })
  id: string;

  @ApiProperty({ description: '리뷰 내용' })
  content: string;

  @ApiProperty({ description: '작성일' })
  createdAt: string;
}

// 리뷰 전용 프로필 정보 DTO
export class ReviewProfileResponseDto {
  @ApiProperty({ description: '프로필 이미지' })
  profileImage: string;

  @ApiProperty({ description: '이름' })
  name: string;
}

// 리뷰 전용 트레이너 정보 DTO
export class ReviewTrainerResponseDto {
  @ApiProperty({ description: '트레이너 닉네임' })
  nickname: string;

  @ApiProperty({ description: '트레이너 프로필 정보', type: ReviewProfileResponseDto })
  profile: ReviewProfileResponseDto;
}

// 리뷰 전용 레슨 요청 정보 DTO
export class ReviewLessonRequestResponseDto {
  @ApiProperty({ description: '견적 종료일' })
  quoteEndDate: string;

  @ApiProperty({ description: '레슨 유형' })
  lessonType: string;
}

// 리뷰 전용 견적 정보 DTO
export class ReviewLessonQuoteResponseDto {
  @ApiProperty({ description: '금액' })
  price: number;

  @ApiProperty({ description: '트레이너 정보', type: ReviewTrainerResponseDto })
  trainer: ReviewTrainerResponseDto;

  @ApiProperty({ description: '레슨 요청 정보', type: ReviewLessonRequestResponseDto })
  lessonRequest: ReviewLessonRequestResponseDto;
}

// 리뷰 응답 DTO (리뷰 목록 및 상세 조회에 사용)
export class ReviewResponseDto {
  @ApiProperty({ description: '평점' })
  rating: number;

  @ApiProperty({ description: '리뷰 내용' })
  content: string;

  @ApiProperty({ description: '작성일' })
  createdAt: string;

  @ApiProperty({ description: '견적 정보', type: ReviewLessonQuoteResponseDto })
  lessonQuote: ReviewLessonQuoteResponseDto;
}

// 리뷰 목록 응답 DTO
export class GetReviewListResponseDto {
  @ApiProperty({ description: '리뷰 목록', type: [ReviewResponseDto] })
  reviews: ReviewResponseDto[];

  @ApiProperty({ description: '총 리뷰 개수' })
  totalCount: number;
}

// 내 리뷰 조회 응답 DTO
export class ReviewMeResponseDto {
  @ApiProperty({ description: '평점' })
  rating: number;

  @ApiProperty({ description: '리뷰 내용' })
  content: string;

  @ApiProperty({ description: '작성일' })
  createdAt: string;

  @ApiProperty({ description: '견적 정보', type: ReviewLessonQuoteResponseDto })
  lessonQuote: ReviewLessonQuoteResponseDto;
}
