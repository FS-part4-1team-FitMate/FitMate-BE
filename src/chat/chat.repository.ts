import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfileRepository } from '#profile/profile.repository.js';
import { IChatRepository } from './interface/chat.repository.interface';
import { Chat } from './schema/chat.schema.js';
import { ChatRoom } from './schema/chatRoom.schema.js';

@Injectable()
export class ChatRepository implements IChatRepository {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
    private readonly profileRepository: ProfileRepository,
  ) {}

  // 메시지 저장 기능
  async saveMessage(chat: Partial<Chat>): Promise<Chat> {
    console.log('💾 [레포지토리] 메시지 MongoDB에 저장 요청:', chat);

    const savedMessage = await this.chatModel.create(chat);

    console.log('✅ [레포지토리] 메시지 MongoDB 저장 완료:', savedMessage);

    return savedMessage;
  }

  // 특정 채팅방의 메시지 조회 기능
  async findMessagesByRoomId(roomId: string, skip: number, limit: number): Promise<Chat[]> {
    return this.chatModel.find({ roomId }).sort({ createdAt: 1 }).skip(skip).limit(limit).lean();
  }

  // 로그인한 유저가 참여 중인 채팅방 조회 기능.
  async findMyChatRooms(userId: string, skip: number, limit: number): Promise<any[]> {
    const chatRooms = await this.chatRoomModel
      .find({ $or: [{ participant1: userId }, { participant2: userId }] })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const roomsWithProfiles = await Promise.all(
      chatRooms.map(async (room) => {
        const participant1Profile = await this.profileRepository.findProfileById(room.participant1);
        const participant2Profile = await this.profileRepository.findProfileById(room.participant2);

        return {
          ...room,
          participant1Profile: { name: participant1Profile?.name || null },
          participant2Profile: { name: participant2Profile?.name || null },
        };
      }),
    );

    return roomsWithProfiles;
  }

  // 특정 채팅방 조회 기능
  async findChatRoomById(roomId: string): Promise<ChatRoom | null> {
    return await this.chatRoomModel.findOne({ roomId });
  }

  // 채팅방 생성 기능
  async createChatRoom(data: Partial<ChatRoom>): Promise<ChatRoom> {
    const chatRoom = new this.chatRoomModel(data);
    return await chatRoom.save();
  }

  // 특정 유저가 보낸 메시지 삭제 기능 (채팅방 나가기 시)
  async deleteMessagesByUser(roomId: string, userId: string): Promise<void> {
    await this.chatModel.deleteMany({ roomId, senderId: userId });
  }

  async findChatRoomByParticipants(participant1: string, participant2: string): Promise<ChatRoom | null> {
    return await this.chatRoomModel.findOne({
      $or: [
        { participant1, participant2 },
        { participant1: participant2, participant2: participant1 },
      ],
    });
  }

  async updateParticipantLeft(roomId: string, participant: 'participant1' | 'participant2'): Promise<void> {
    await this.chatRoomModel.updateOne({ roomId }, { $set: { [`left_${participant}`]: true } });
  }

  async deleteChatRoom(roomId: string): Promise<void> {
    await this.chatModel.deleteMany({ roomId });
    await this.chatRoomModel.deleteOne({ roomId });
  }

  // 메시지 읽음 처리
  async updateMessagesAsRead(roomId: string, userId: string): Promise<void> {
    await this.chatModel.updateMany({ roomId, senderId: { $ne: userId }, isRead: false }, { isRead: true });
  }
}
