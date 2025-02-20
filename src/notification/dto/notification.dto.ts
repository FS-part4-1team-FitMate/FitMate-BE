import { ApiProperty } from '@nestjs/swagger';
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

export class NotificationResponseDto {
  @ApiProperty({ description: '알림 ID' })
  id: number;

  @ApiProperty({ description: '사용자 ID' })
  userId: string;

  @ApiProperty({ description: '알림 유형' })
  type: string;

  @ApiProperty({ description: '알림 메시지' })
  message: string;

  @ApiProperty({ description: '읽음 여부' })
  isRead: boolean;

  @ApiProperty({ description: '생성 일자' })
  createdAt: string;
}

export class NotificationListResponseDto {
  @ApiProperty({ description: '알림 목록', type: [NotificationResponseDto] })
  list: NotificationResponseDto[];

  @ApiProperty({ description: '총 개수' })
  totalCount: number;

  @ApiProperty({ description: '다음 페이지 여부' })
  hasMore: boolean;
}
