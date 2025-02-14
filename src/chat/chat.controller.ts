import { Controller, Get, Post, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 1. 특정 유저와 트레이너의 채팅방 가져오기
  @Post('room')
  @UseGuards(AccessTokenGuard)
  async createOrGetChatRoom(@Body('userId') userId: string, @Body('trainerId') trainerId: string) {
    return { roomId: await this.chatService.createOrGetChatRoom(trainerId) };
  }

  // 2. 메시지 전송 (roomId 기반)
  @Post('send')
  @UseGuards(AccessTokenGuard)
  async sendMessage(@Body() createChatDto: CreateChatDto) {
    return await this.chatService.createMessage(createChatDto);
  }

  // 3. 특정 채팅방의 메시지 가져오기 (페이징 적용)
  @Get('messages/:roomId')
  @UseGuards(AccessTokenGuard)
  async getMessages(
    @Param('roomId') roomId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return await this.chatService.getMessages(roomId, page, limit);
  }
}
