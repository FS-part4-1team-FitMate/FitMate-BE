import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class ProfileResponseDto {
  @ApiProperty({ description: '프로필 ID' })
  id: string;

  @ApiProperty({ description: '사용자 ID' })
  userId: string;

  @ApiPropertyOptional({ description: '이름' })
  name?: string;

  @ApiPropertyOptional({ description: '프로필 이미지 URL' })
  profileImage?: string;

  @ApiPropertyOptional({ description: '휴대폰 번호' })
  phone?: string;

  @ApiProperty({ description: '성별', enum: Gender })
  gender: Gender;

  @ApiProperty({ description: '레슨 타입' })
  lessonType: string[];

  @ApiProperty({ description: '지역' })
  region: string[];

  @ApiPropertyOptional({ description: '한줄 소개' })
  intro?: string;

  @ApiPropertyOptional({ description: '자기 소개' })
  description?: string;

  @ApiPropertyOptional({ description: '강의 경험 (연수)' })
  experience?: number;

  @ApiPropertyOptional({ description: '자격증' })
  certification?: string;

  @ApiProperty({ description: '자격증 인증 여부' })
  certificationValidated: boolean;

  @ApiProperty({ description: '평점' })
  rating: number;

  @ApiProperty({ description: '총 레슨 횟수' })
  lessonCount: number;

  @ApiProperty({ description: '총 리뷰 수' })
  reviewCount: number;

  @ApiProperty({ description: '프로필 생성 일자' })
  createdAt: string;

  @ApiProperty({ description: '프로필 수정 일자' })
  updatedAt: string;
}

export class ProfileSimpleResponseDto {
  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '성별', enum: Gender })
  gender: Gender;

  @ApiProperty({ description: '지역' })
  region: string[];
}
