import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QuoteStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateQuoteDto {
  @ApiProperty({
    description: '레슨 요청 ID',
  })
  @IsNotEmpty({ message: '레슨 요청 ID는 필수 입력 값입니다.' })
  @IsString()
  lessonRequestId: string;

  @ApiProperty({
    description: '견적 가격',
  })
  @IsNotEmpty({ message: '가격은 필수 입력 값입니다.' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: '견적 메시지',
  })
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
  @ApiPropertyOptional({
    description: '견적 상태 (예: PENDING, ACCEPTED, REJECTED)',
    enum: QuoteStatus,
  })
  @IsOptional()
  @IsEnum(QuoteStatus, { message: '유효하지 않은 상태 값입니다.' })
  status: QuoteStatus;

  @ApiPropertyOptional({
    description: '견적 반려 사유',
    example: '다른 견적을 선택했습니다.',
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class QueryQuoteDto {
  @ApiPropertyOptional({ description: '페이지 번호 (기본값: 1)' })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? Number(value) : 1))
  page?: number = 1;

  @ApiPropertyOptional({ description: '페이지당 항목 수 (기본값: 5)' })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? Number(value) : 5))
  limit?: number = 5;

  @ApiPropertyOptional({ description: '정렬 기준 (created_at, price, updated_at)' })
  @IsOptional()
  @IsString()
  @IsIn(['created_at', 'price', 'updated_at'])
  order?: string = 'created_at';

  @ApiPropertyOptional({ description: '정렬 방향 (asc 또는 desc, 기본값: desc)' })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sort?: string = 'desc';

  @ApiPropertyOptional({
    description: '견적 상태 (콤마로 구분, 예: "PENDING,ACCEPTED,REJECTED")',
    enum: QuoteStatus,
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(QuoteStatus, { each: true, message: '유효하지 않은 견적 상태입니다.' })
  status?: QuoteStatus[]; // 견적 상태 필터링

  @ApiPropertyOptional({ description: '트레이너 ID' })
  @IsOptional()
  @IsString()
  trainer_id?: string; // 특정 트레이너의 견적 필터링

  @ApiPropertyOptional({ description: '최소 가격' })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsInt({ message: 'min_price는 숫자여야 합니다.' })
  min_price?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: '최대 가격' })
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsInt({ message: 'max_price는 숫자여야 합니다.' })
  max_price?: number;

  @ApiPropertyOptional({ description: '특정 레슨 요청 ID' })
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
