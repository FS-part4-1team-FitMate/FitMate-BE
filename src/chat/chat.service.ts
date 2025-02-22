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
    const { roomId, message } = createChatDto;

    const newMessage = await this.chatRepository.saveMessage({
      roomId,
      senderId: userId,
      message,
      isRead: false,
    });

    return newMessage;
  }

  // 특정 채팅방의 메시지 가져오기
  async getMessages(roomId: string, page: number, limit: number): Promise<ChatMessageResponse[]> {
    const chatRoom = await this.chatRepository.findChatRoomById(roomId);
    if (!chatRoom) throw new NotFoundException(ChatExceptionMessage.DELETED_CHAT_ROOM);

    const { userId } = this.alsStore.getStore();

    // 유저가 나간 채팅방이라면 메시지 조회 불가
    if (
      (chatRoom.participant1 === userId && chatRoom.left_participant1) ||
      (chatRoom.participant2 === userId && chatRoom.left_participant2)
    ) {
      throw new ForbiddenException(ChatExceptionMessage.DELETED_CHAT_ROOM);
    }

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

    // 유저가 나간 채팅방은 조회되지 않도록 필터링
    const chatRooms = await this.chatRepository.findMyChatRooms(userId, skip, limit);
    const filteredChatRooms = chatRooms.filter(
      (chatRoom) =>
        !(chatRoom.participant1 === userId && chatRoom.left_participant1) &&
        !(chatRoom.participant2 === userId && chatRoom.left_participant2),
    );

    return filteredChatRooms;
  }

  // 채팅방 나가기
  async leaveChatRoom(roomId: string): Promise<void> {
    const { userId } = this.alsStore.getStore();
    const chatRoom = await this.chatRepository.findChatRoomById(roomId);
    if (!chatRoom) throw new NotFoundException(ChatExceptionMessage.CHAT_ROOM_NOT_FOUND);

    if (chatRoom.participant1 === userId) {
      await this.chatRepository.updateParticipantLeft(roomId, 'participant1');
    } else if (chatRoom.participant2 === userId) {
      await this.chatRepository.updateParticipantLeft(roomId, 'participant2');
    }

    const updatedChatRoom = await this.chatRepository.findChatRoomById(roomId);
    if (!updatedChatRoom) return; // 채팅방이 이미 삭제된 경우 바로 반환

    if (updatedChatRoom.left_participant1 && updatedChatRoom.left_participant2) {
      await this.chatRepository.deleteChatRoom(roomId);
    }
  }

  async markMessagesAsRead(roomId: string, userId: string): Promise<void> {
    await this.chatRepository.updateMessagesAsRead(roomId, userId);
  }
}
