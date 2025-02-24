import { Chat } from '../schema/chat.schema.js';
import { ChatRoom } from '../schema/chatRoom.schema.js';

export interface IChatRepository {
  saveMessage(chat: Partial<Chat>): Promise<Chat>;
  findMessagesByRoomId(roomId: string, skip: number, limit: number): Promise<Chat[]>;
  findMyChatRooms(userId: string, skip: number, limit: number): Promise<ChatRoom[]>;
  findChatRoomById(roomId: string): Promise<ChatRoom | null>;
  createChatRoom(data: Partial<ChatRoom>): Promise<ChatRoom>;
  deleteMessagesByUser(roomId: string, userId: string): Promise<void>;
  findChatRoomByParticipants(participant1: string, participant2: string): Promise<ChatRoom | null>;
  updateParticipantLeft(roomId: string, userId: string): Promise<void>;
  deleteChatRoom(roomId: string): Promise<void>;
  updateMessagesAsRead(roomId: string, userId: string): Promise<void>;
}
