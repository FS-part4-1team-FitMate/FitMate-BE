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

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: CreateChatDto, @ConnectedSocket() client: Socket) {
    const message = await this.chatService.createMessage(data);
    return this.server.emit('receiveMessage', message);
  }
}
