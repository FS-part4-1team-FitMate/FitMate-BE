import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class ProfileResponseDto {
  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '성별', enum: Gender })
  gender: Gender;

  @ApiProperty({ description: '지역' })
  region: string[];
}
