import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class QueryNotificationDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? Number(value) : 1))
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? Number(value) : 5))
  limit?: number;

  @IsOptional()
  @IsString()
  @IsIn(['created_at', 'updated_at'])
  order?: string = 'created_at';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sort?: string = 'desc';
}
