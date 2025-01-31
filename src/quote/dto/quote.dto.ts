import { QuoteStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateQuoteDto {
  @IsNotEmpty({ message: '레슨 요청 ID는 필수 입력 값입니다.' })
  @IsString()
  lessonRequestId: string;

  @IsNotEmpty({ message: '가격은 필수 입력 값입니다.' })
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty({ message: '메시지는 필수 입력 값입니다.' })
  @IsString()
  message: string;
}

export class UpdateQuoteDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  message?: string;
}

export class UpdateQuoteStatusDto {
  @IsOptional()
  @IsEnum(QuoteStatus, { message: '유효하지 않은 상태 값입니다.' })
  status: QuoteStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class QueryQuoteDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? Number(value) : 1))
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? Number(value) : 10))
  limit?: number = 5;

  @IsOptional()
  @IsString()
  @IsIn(['created_at', 'price', 'updated_at'])
  order?: string = 'created_at';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sort?: string = 'desc';

  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(QuoteStatus, { each: true, message: '유효하지 않은 견적 상태입니다.' })
  status?: QuoteStatus[]; // 견적 상태 필터링

  @IsOptional()
  @IsString()
  trainer_id?: string; // 특정 트레이너의 견적 필터링

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsInt({ message: 'min_price는 숫자여야 합니다.' })
  min_price?: number;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsInt({ message: 'max_price는 숫자여야 합니다.' })
  max_price?: number;

  @IsOptional()
  @IsString()
  lesson_request_id?: string; // 특정 레슨 요청 ID

  // CamelCase 변환 메서드
  toCamelCase() {
    return {
      page: this.page,
      limit: this.limit,
      order: this.order,
      sort: this.sort,
      status: this.status,
      trainerId: this.trainer_id,
      minPrice: this.min_price,
      maxPrice: this.max_price,
      lessonRequestId: this.lesson_request_id,
    };
  }
}
