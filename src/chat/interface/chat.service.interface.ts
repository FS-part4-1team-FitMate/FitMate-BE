import { Chat } from '../schema/chat.schema.js';
import { ChatRoom } from '../schema/chatRoom.schema.js';
import { CreateChatDto } from '../dto/chat.dto.js';
import { ChatMessageResponse } from '../type/chat.type.js';

export interface IChatService {
  createMessage(createChatDto: CreateChatDto): Promise<Chat>;
  getMessages(roomId: string, page: number, limit: number): Promise<ChatMessageResponse[]>;
  createOrGetChatRoom(participantId: string): Promise<string>;
  getMyChatRooms(page: number, limit: number): Promise<ChatRoom[]>;
  leaveChatRoom(roomId: string): Promise<void>;
  markMessagesAsRead(roomId: string, userId: string): Promise<void>;
}
