import { Notification } from '@prisma/client';
import { Observable } from 'rxjs';
import { NotificationResponse } from '#notification/type/notification.type.js';
import { QueryNotificationDto } from '../dto/notification.dto.js';

export interface INotificationService {
  /**
   * SSE를 사용하여 사용자별 실시간 알림을 구독
   * @param userId 사용자 ID
   * @returns Observable 스트림
   */
  getUserNotificationStream(userId: string): Observable<any>;

  /**
   * PostgreSQL 알림 리스너를 초기화
   */
  listenForNotifications(): Promise<void>;

  /**
   * 애플리케이션 시작 시 실행 (PostgreSQL 연결 및 알림 수신)
   */
  onModuleInit(): Promise<void>;

  /**
   * 애플리케이션 종료 시 실행 (PostgreSQL 연결 해제 및 스트림 정리)
   */
  onModuleDestroy(): Promise<void>;

  /**
   * 알림 목록을 조회
   * @param query QueryNotificationDto
   * @returns 알림 목록 및 페이징 정보
   */
  getNotifications(query: QueryNotificationDto): Promise<{
    list: Notification[];
    totalCount: number;
    hasMore: boolean;
  }>;

  /**
   * 알림 읽음 상태 토글
   * @param notificationId 알림 ID
   * @returns 업데이트된 알림 정보
   */
  toggleNotificaitonRead(notificationId: number): Promise<NotificationResponse>;

  /**
   * 레슨 시작 알림 생성
   * @param userId 사용자 ID
   * @param nickname 사용자 닉네임
   * @param lessonSubType 레슨 서브타입(예: '골프', '요가' 등)
   * @param now 현재 시간
   * @returns 생성된 알림 정보(이미 존재한다면 null)
   */
  createLessonStartNotification(
    userId: string,
    nickname: string,
    lessonSubType: string,
    now: Date,
  ): Promise<NotificationResponse | null>;

  /**
   * 채팅방 생성 알림
   * @param userId 사용자 ID
   * @param message 알림 메시지
   * @returns 생성된 알림 정보
   */
  createChatNotification(userId: string, message: string): Promise<NotificationResponse>;
}
