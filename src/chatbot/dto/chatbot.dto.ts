import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatbotRequestDto {
  @ApiProperty({ description: '사용자가 챗봇에게 보낼 메시지' })
  @IsNotEmpty({ message: '메시지는 필수 입력 값입니다.' })
  @IsString({ message: '메시지는 문자열이어야 합니다.' })
  message: string;
}

export class ChatbotResponseDto {
  @ApiProperty({
    description: '챗봇의 응답 메시지',
    example: '무릎 통증에는 재활 스트레칭이 효과적입니다. 햄스트링 스트레칭을 10초간 해보세요.',
  })
  response: string;
}
