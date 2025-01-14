import { QuoteStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateQuoteDto {
  @IsNotEmpty({ message: '레슨 요청 ID는 필수 입력 값입니다.' })
  @IsString()
  lessonRequestId: string;

  // @IsNotEmpty({ message: '트레이너 ID는 필수 입력 값입니다.' })
  // @IsString()
  // trainerId: string;

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
  @Transform(({ value }) => Number(value) || 1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value) || 5)
  @IsOptional()
  @IsEnum(QuoteStatus, { message: '유효하지 않은 상태 값입니다.' })
  status?: QuoteStatus;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  order?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sort?: string = 'desc';
}
