import { ApiProperty } from '@nestjs/swagger';
import { ProfileSimpleResponseDto } from '#profile/dto/profile.dto.js';
export class UserResponseDto {
  @ApiProperty({ description: '사용자 ID' })
  id: string;

  @ApiProperty({ description: '이메일' })
  email: string;

  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @ApiProperty({ description: '사용자 역할' })
  role: string;

  @ApiProperty({ description: '생성 일자' })
  createdAt: string;

  @ApiProperty({ description: '수정 일자' })
  updatedAt: string;
}

export class UserSimpleResponseDto {
  @ApiProperty({ description: '사용자 ID' })
  id: string;

  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @ApiProperty({ description: '프로필 정보', type: ProfileSimpleResponseDto })
  profile: ProfileSimpleResponseDto;
}
