import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './chat.repository.js';
import { Chat, ChatSchema } from './chat.schema';
import { ChatService } from './chat.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]), // 등록 확인
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, ChatRepository],
  exports: [ChatService],
})
export class ChatModule {}
