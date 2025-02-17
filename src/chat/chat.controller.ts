import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { ChatService } from './chat.service.js';
import { CreateChatDto, GetMessagesQueryDto, GetMyChatRoomsQueryDto } from './dto/chat.dto.js';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 1. 채팅방 생성 (유저/트레이너 구분 없이 가능)
  @Post('room')
  @UseGuards(AccessTokenGuard)
  async createOrGetChatRoom(@Body('participantId') participantId: string) {
    return { roomId: await this.chatService.createOrGetChatRoom(participantId) };
  }

  // 2. 메시지 전송 (로그인한 유저 기준)
  @Post('send')
  @UseGuards(AccessTokenGuard)
  async sendMessage(@Body() createChatDto: CreateChatDto) {
    return await this.chatService.createMessage(createChatDto);
  }

  // 3. 특정 채팅방의 메시지 가져오기 (페이징 적용)
  @Get('messages/:roomId')
  @UseGuards(AccessTokenGuard)
  async getMessages(@Param('roomId') roomId: string, @Query() query: GetMessagesQueryDto) {
    return await this.chatService.getMessages(roomId, query.page, query.limit);
  }

  // 4. 로그인한 유저의 채팅방 목록
  @Get('rooms')
  @UseGuards(AccessTokenGuard)
  async getMyChatRooms(@Query() query: GetMyChatRoomsQueryDto) {
    return await this.chatService.getMyChatRooms(query.page, query.limit);
  }

  // 5. 채팅방 나가기
  @Post('leave/:roomId')
  @UseGuards(AccessTokenGuard)
  async leaveChatRoom(@Param('roomId') roomId: string) {
    await this.chatService.leaveChatRoom(roomId);
    return { message: '채팅방을 성공적으로 나갔습니다.' };
  }
}
