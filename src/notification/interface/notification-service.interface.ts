import { Notification } from '@prisma/client';
import { Observable } from 'rxjs';
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
}
