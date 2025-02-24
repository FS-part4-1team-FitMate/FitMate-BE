import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service.js';
import { CreateChatDto } from './dto/chat.dto.js';

@WebSocketGateway({
  namespace: '/socket.io/',
  cors: {
    origin: process.env.FRONTEND_BASE_URL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  // ✅ 특정 채팅방(roomId)에 클라이언트 조인
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.join(roomId);
  }

  // ✅ 메시지를 특정 roomId에 속한 유저에게만 전송
  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: CreateChatDto) {
    const message = await this.chatService.createMessage(data);
    this.server.to(data.roomId).emit('receiveMessage', message);
  }

  // ✅ 방 나가기
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.leave(roomId);
  }

  // ✅ 소켓 연결 해제 시 모든 방에서 클라이언트 제거
  handleDisconnect(@ConnectedSocket() client: Socket) {}
}
