import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '#user/user.module.js';
import { ProfileModule } from '#profile/profile.module.js';
import { ChatController } from './chat.controller.js';
import { ChatGateway } from './chat.gateway.js';
import { ChatRepository } from './chat.repository.js';
import { Chat, ChatSchema } from './chat.schema.js';
import { ChatService } from './chat.service.js';
import { ChatRoom, ChatRoomSchema } from './chatRoom.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: ChatRoom.name, schema: ChatRoomSchema }]),
    ProfileModule,
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, ChatRepository],
  exports: [ChatService],
})
export class ChatModule {}
