import { Module } from '@nestjs/common';
import { UserModule } from '#user/user.module.js';
import { UserService } from '#user/user.service.js';
import { ChatbotController } from './chatbot.controller.js';
import { ChatbotService } from './chatbot.service.js';

@Module({
  imports: [UserModule],
  controllers: [ChatbotController],
  providers: [ChatbotService, UserService],
})
export class ChatbotModule {}
