import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { ChatbotService } from './chatbot.service.js';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  @UseGuards(AccessTokenGuard)
  async sendMessage(@Body('message') message: string) {
    const response = await this.chatbotService.getChatbotResponse(message);
    return { response };
  }
}
