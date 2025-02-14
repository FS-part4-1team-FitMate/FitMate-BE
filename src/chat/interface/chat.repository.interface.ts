import { Chat } from '../chat.schema';

export interface IChatRepository {
  saveMessage(chat: Partial<Chat>): Promise<Chat>;
  findMessagesByRoomId(roomId: string, skip: number, limit: number): Promise<Chat[]>;
}
