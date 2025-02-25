import { JwtService } from '@nestjs/jwt';
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
    console.log(`🔹 joinRoom 요청 데이터 타입:`, typeof roomId);
    console.log(`✅ 클라이언트 ${client.id}가 채팅방 ${roomId} 에 참여함`);
    client.join(roomId);
  }

  // ✅ 메시지를 특정 roomId에 속한 유저에게만 전송
  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: CreateChatDto, @ConnectedSocket() client: Socket) {
    console.log(`📩 메시지 수신:`, data);

    // WebSocket 연결 시 저장된 senderId 가져오기
    const senderId = data.senderId;

    if (!senderId) {
      console.error('❌ WebSocket 메시지 전송 실패: senderId 없음');
      return;
    }

    const message = await this.chatService.createMessage({ ...data, senderId }); // ✅ senderId 함께 전달

    console.log(`📤 메시지 저장 완료:`, message);
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
