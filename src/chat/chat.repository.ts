import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './chat.schema';
import { IChatRepository } from './interface/chat.repository.interface';
import { ChatMessage } from './type/chat.type.js';

@Injectable()
export class ChatRepository implements IChatRepository {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  async saveMessage(chat: Partial<Chat>): Promise<Chat> {
    return await this.chatModel.create(chat);
  }

  async findMessagesByRoomId(roomId: string, skip: number, limit: number): Promise<Chat[]> {
    return this.chatModel.find({ roomId }).sort({ createdAt: 1 }).skip(skip).limit(limit).lean();
  }
}
