import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AlsStore } from '#common/als/store-validator.js';
import ChatExceptionMessage from '#exception/chat-exception-message.js';
import { UserService } from '#user/user.service.js';
import { ProfileService } from '#profile/profile.service.js';
import { fetchUserDetails } from '#utils/chat-utils.js';
import { ChatRepository } from './chat.repository.js';
import { Chat } from './chat.schema.js';
import { ChatRoom } from './chatRoom.schema.js';
import { CreateChatDto } from './dto/chat.dto.js';
import { IChatService } from './interface/chat.service.interface.js';
import { ChatMessageResponse } from './type/chat.type.js';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
    private readonly alsStore: AlsStore,
  ) {}

  // 채팅방 생성 또는 기존 채팅방 반환
  async createOrGetChatRoom(participantId: string): Promise<string> {
    const { userId } = this.alsStore.getStore();
    // 현재 userId와 participantId가 포함된 채팅방을 찾음
    let chatRoom = await this.chatRepository.findChatRoomByParticipants(userId, participantId);

    if (!chatRoom) {
      chatRoom = await this.chatRepository
        .createChatRoom({
          participant1: userId,
          participant2: participantId,
          roomId: uuidv4(),
        })
        .catch(() => {
          throw new InternalServerErrorException(ChatExceptionMessage.CHAT_ROOM_CREATION_FAILED);
        });
    }
    return chatRoom.roomId;
  }

  // 메시지 저장
  async createMessage(createChatDto: CreateChatDto): Promise<Chat> {
    const { userId } = this.alsStore.getStore();
    const { receiverId, message } = createChatDto;
    const roomId = await this.createOrGetChatRoom(receiverId);

    const newMessage = await this.chatRepository
      .saveMessage({
        roomId,
        senderId: userId,
        receiverId,
        message,
        isRead: false,
      })
      .catch(() => {
        throw new InternalServerErrorException(ChatExceptionMessage.MESSAGE_SAVE_FAILED);
      });

    return newMessage;
  }

  // 특정 채팅방의 메시지 가져오기
  async getMessages(roomId: string, page: number, limit: number): Promise<ChatMessageResponse[]> {
    if (page <= 0 || limit <= 0) {
      throw new BadRequestException(ChatExceptionMessage.INVALID_PAGE_OR_LIMIT);
    }

    const skip = (page - 1) * limit;
    const messages = await this.chatRepository.findMessagesByRoomId(roomId, skip, limit);

    const users: Record<string, { nickname: string; profileImage: string | null }> = {};
    for (const msg of messages) {
      if (!users[msg.senderId]) {
        users[msg.senderId] = await fetchUserDetails(msg.senderId, this.userService, this.profileService);
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

  // 로그인한 유저가 참여 중인 채팅방 목록
  async getMyChatRooms(page: number, limit: number): Promise<ChatRoom[]> {
    if (page <= 0 || limit <= 0) {
      throw new BadRequestException(ChatExceptionMessage.INVALID_PAGE_OR_LIMIT);
    }

    const { userId } = this.alsStore.getStore();
    const skip = (page - 1) * limit;
    const chatRooms = await this.chatRepository.findMyChatRooms(userId, skip, limit).catch(() => {
      throw new InternalServerErrorException(ChatExceptionMessage.CHAT_ROOM_LIST_FAILED);
    });

    return chatRooms ?? [];
  }

  // 채팅방 나가기
  async leaveChatRoom(roomId: string): Promise<void> {
    const { userId } = this.alsStore.getStore();
    const chatRoom = await this.chatRepository.findChatRoomById(roomId);

    if (!chatRoom) throw new NotFoundException(ChatExceptionMessage.CHAT_ROOM_NOT_FOUND);
    if (chatRoom.participant1 === userId || chatRoom.participant2 === userId) {
      await this.chatRepository.deleteMessagesByUser(roomId, userId);
    } else {
      throw new ForbiddenException(ChatExceptionMessage.CHAT_ROOM_FORBIDDEN);
    }
  }
}
