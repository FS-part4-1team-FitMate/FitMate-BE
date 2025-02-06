import { Transform } from 'class-transformer';
import { IsNotEmpty, IsInt, Min, Max, IsUUID, IsString, Length, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsUUID('4', { message: '유효하지 않은 견적 ID입니다.' })
  lessonQuoteId: string;

  @IsNotEmpty()
  @IsInt({ message: '평점은 숫자여야 합니다.' })
  @Min(1, { message: '평점은 최소 1점 이상이어야 합니다.' })
  @Max(5, { message: '평점은 최대 5점 이하이어야 합니다.' })
  rating: number;

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
