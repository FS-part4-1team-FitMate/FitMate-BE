import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, LessonType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsEnum, IsIn } from 'class-validator';
import { ProfileResponseDto } from '#profile/dto/profile.dto.js';

export class QueryTrainerDto {
  @ApiPropertyOptional({ description: '페이지 번호 (기본값: 1)' })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  page?: number;

  @ApiPropertyOptional({ description: '페이지당 항목 수 (기본값: 10)' })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  limit?: number;

  @ApiPropertyOptional({ description: '검색 키워드' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '운동 유형 (배열로 전달 가능, 예: FITNESS, REHAB)' })
  @IsOptional()
  @Transform(({ value }) => value?.split(','))
  @IsEnum(LessonType, { each: true, message: '유효하지 않은 운동 유형입니다.' })
  lessonType?: LessonType[];

  @ApiPropertyOptional({ description: '트레이너 성별 (MALE 또는 FEMALE)' })
  @IsOptional()
  @IsEnum(Gender, { message: '유효하지 않은 성별 값입니다.' })
  gender?: Gender;

  @ApiPropertyOptional({ description: '정렬 기준 (reviewCount, rating, experience, lessonCount)' })
  @IsOptional()
  @IsString()
  @IsIn(['reviewCount', 'rating', 'experience', 'lessonCount'], {
    message: '유효하지 않은 정렬 기준입니다.',
  })
  order?: string;

  @ApiPropertyOptional({ description: '정렬 방식 (asc 또는 desc)' })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: '유효하지 않은 정렬 방식입니다.' })
  sort?: string;
}

export class TrainerWithFavoritesResponseDto {
  @ApiProperty({ description: '트레이너 ID' })
  id: string;

  @ApiProperty({ description: '트레이너 닉네임' })
  nickname: string;

  @ApiProperty({ description: '트레이너 이메일' })
  email: string;

  @ApiProperty({ description: '트레이너 생성 일자' })
  createdAt: string;

  @ApiProperty({ description: '트레이너 수정 일자' })
  updatedAt: string;

  @ApiProperty({ description: '트레이너 프로필 정보', type: ProfileResponseDto })
  profile: ProfileResponseDto;

  @ApiProperty({
    description: '찜한 사용자 수',
    type: Number,
  })
  _count: { favoritedByUsers: number };

  @ApiProperty({ description: '사용자가 해당 트레이너를 찜했는지 여부' })
  isFavorite: boolean;
}

export class TrainerListResponseDto {
  @ApiProperty({ description: '트레이너 목록', type: [TrainerWithFavoritesResponseDto] })
  trainers: TrainerWithFavoritesResponseDto[];

  @ApiProperty({ description: '전체 트레이너 수' })
  totalCount: number;

  @ApiProperty({ description: '다음 페이지 여부' })
  hasMore: boolean;
}

export class FavoriteTrainerStatusResponseDto {
  @ApiProperty({ description: '사용자가 해당 트레이너를 찜했는지 여부' })
  isFavorite: boolean;

  @ApiProperty({ description: '트레이너의 총 찜 개수' })
  favoriteTotalCount: number;
}

export class FavoriteTrainerResponseDto {
  @ApiProperty({ description: '찜 ID' })
  id: string;

  @ApiProperty({ description: '사용자 ID' })
  userId: string;

  @ApiProperty({ description: '트레이너 ID' })
  trainerId: string;

  @ApiProperty({ description: '찜 등록 시간' })
  createdAt: string;

  @ApiProperty({ description: '찜 마지막 수정 시간' })
  updatedAt: string;
}
