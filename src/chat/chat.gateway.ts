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

  // 클라이언트가 특정 채팅방에 들어올 때 해당 roomId에 조인
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.join(roomId);
  }

  // 메시지를 특정 roomId에 속한 클라이언트에게만 전송
  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: CreateChatDto, @ConnectedSocket() client: Socket) {
    const message = await this.chatService.createMessage(data);
    this.server.to(data.roomId).emit('receiveMessage', message);
  }

  // 메시지를 읽음 처리
  @SubscribeMessage('readMessage')
  async handleReadMessage(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    const { userId } = client.handshake.auth;
    await this.chatService.markMessagesAsRead(roomId, userId);
  }

  // 소켓 연결 해제 처리
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }
}
