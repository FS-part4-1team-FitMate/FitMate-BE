import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { ChatbotService } from './chatbot.service.js';
import { ChatbotRequestDto, ChatbotResponseDto } from './dto/chatbot.dto.js';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '챗봇과 대화', description: '사용자의 입력 메시지를 받아 챗봇이 응답합니다' })
  @ApiResponse({ status: 201, description: '챗봇 응답 성공', type: ChatbotResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 500, description: '서버 오류' })
  async sendMessage(@Body() body: ChatbotRequestDto): Promise<ChatbotResponseDto> {
    const response = await this.chatbotService.getChatbotResponse(body.message);
    return { response };
  }
}
