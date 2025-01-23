import { IsNotEmpty, IsInt, Min, Max, IsUUID, IsString, Length } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsUUID('4', { message: '유효하지 않은 견적 ID입니다.' })
  lessonQuoteId: string;

  @IsNotEmpty()
  @IsInt({ message: '평점은 숫자여야 합니다.' })
  @Min(1, { message: '평점은 최소 1점 이상이어야 합니다.' })
  @Max(5, { message: '평점은 최대 5점 이하이어야 합니다.' })
  rating: number;

  @IsNotEmpty()
  @IsString()
  @Length(5, 500, { message: '리뷰 내용은 최소 5자에서 최대 500자까지 입력 가능합니다.' })
  content: string;
}
