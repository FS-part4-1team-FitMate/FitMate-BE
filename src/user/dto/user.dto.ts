import { ApiProperty } from '@nestjs/swagger';
import { ProfileResponseDto } from '#profile/dto/profile.dto.js';

export class UserResponseDto {
  @ApiProperty({ description: '사용자 ID' })
  id: string;

  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @ApiProperty({ description: '프로필 정보', type: ProfileResponseDto })
  profile: ProfileResponseDto;
}
