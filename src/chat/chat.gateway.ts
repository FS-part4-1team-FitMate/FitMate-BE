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

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      console.log('🔹 WebSocket 요청 헤더:', client.handshake.headers);
      console.log('🔹 WebSocket 요청 auth:', client.handshake.auth);

      let token = client.handshake.auth?.token; // ✅ 기존 방식

      // ✅ 헤더에서 토큰을 가져오는 방식 추가
      if (!token && client.handshake.headers.authorization) {
        token = client.handshake.headers.authorization.replace('Bearer ', '');
      }

      if (!token) {
        console.log('❌ WebSocket 인증 실패: 토큰 없음');
        client.disconnect(); // 🚨 토큰이 없으면 강제 연결 해제
        return;
      }

      // 🔹 토큰 검증
      const payload = this.jwtService.verify(token);
      client.data.userId = payload.userId; // ✅ 검증된 userId 저장
      console.log(`✅ WebSocket 연결 성공! 유저 ID: ${payload.userId}`);
    } catch (error) {
      console.log('❌ WebSocket 인증 실패:', error);
      client.disconnect(); // 🚨 인증 실패 시 강제 연결 해제
    }
  }

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

    // WebSocket 연결 시 저장된 userId 가져오기
    const userId = client.data.userId;

    if (!userId) {
      console.error('❌ WebSocket 메시지 전송 실패: userId 없음');
      return;
    }

    const message = await this.chatService.createMessage({ ...data, userId }); // ✅ userId 함께 전달

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
