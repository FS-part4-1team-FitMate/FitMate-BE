import { Chat } from '../chat.schema';
import { CreateChatDto } from '../dto/chat.dto';
import { ChatMessageResponse } from '../type/chat.type.js';

export interface IChatService {
  createMessage(createChatDto: CreateChatDto): Promise<Chat>;
  getMessages(roomId: string, page: number, limit: number): Promise<ChatMessageResponse[]>;
  createOrGetChatRoom(userId: string, trainerId: string): Promise<string>;
}
