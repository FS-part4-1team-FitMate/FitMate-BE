import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { AlsStore } from '#common/als/store-validator.js';
import { UserService } from '#user/user.service.js';
import { ProfileService } from '#profile/profile.service.js';
import { ChatRepository } from './chat.repository.js';
import { Chat } from './chat.schema.js';
import { ChatRoom } from './chatRoom.schema';
import { CreateChatDto } from './dto/chat.dto.js';
import { IChatService } from './interface/chat.service.interface.js';
import { ChatMessageResponse } from './type/chat.type.js';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    private readonly chatRepository: ChatRepository,
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
    private readonly alsStore: AlsStore,
  ) {}

  // 1. 로그인한 유저 기준으로 채팅방 생성 또는 기존 채팅방 반환
  async createOrGetChatRoom(trainerId: string): Promise<string> {
    const { userId } = this.alsStore.getStore();
    let chatRoom = await this.chatRoomModel.findOne({ userId, trainerId });

    if (!chatRoom) {
      chatRoom = new this.chatRoomModel({ userId, trainerId, roomId: uuidv4() });
      await chatRoom.save();
    }

    return chatRoom.roomId;
  }

  // 2. 메시지 저장
  async createMessage(createChatDto: CreateChatDto): Promise<Chat> {
    const { userId } = this.alsStore.getStore();
    const { receiverId, message } = createChatDto;

    // 로그인한 유저의 ID를 발신자로 설정

    // 채팅방 가져오기 (없으면 생성)
    const roomId = await this.createOrGetChatRoom(receiverId);

    const newMessage = await this.chatRepository.saveMessage({
      roomId,
      senderId: userId,
      receiverId,
      message,
      isRead: false,
    });

    return newMessage;
  }

  // 3. 특정 채팅방의 메시지 가져오기 (닉네임 & 프로필 이미지 포함)
  async getMessages(roomId: string, page: number, limit: number): Promise<ChatMessageResponse[]> {
    const { userId } = this.alsStore.getStore();
    const skip = (page - 1) * limit;

    const messages = await this.chatRepository.findMessagesByRoomId(roomId, skip, limit);

    const users: Record<string, { nickname: string; profileImage: string | null }> = {};

    for (const msg of messages) {
      if (!users[msg.senderId]) {
        try {
          // 닉네임 가져오기 (UserService 활용)
          const user = await this.userService.findUserById(msg.senderId);

          // 프로필 이미지 가져오기 (ProfileService 활용)
          const profile = await this.profileService.findProfileById(msg.senderId);

          users[msg.senderId] = {
            nickname: user.nickname,
            profileImage: profile.profileImagePresignedUrl || null,
          };
        } catch (error) {
          users[msg.senderId] = { nickname: 'Unknown', profileImage: null };
        }
      }
    }

    return messages.map((msg) => ({
      senderId: msg.senderId,
      senderNickname: users[msg.senderId].nickname,
      senderProfileImage: users[msg.senderId].profileImage,
      message: msg.message,
      createdAt: msg.createdAt ?? new Date(),
    }));
  }
}
