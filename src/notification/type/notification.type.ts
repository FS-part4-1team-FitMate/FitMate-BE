import type { Notification } from '@prisma/client';

/**
 * PostgreSQL NOTIFY 이벤트로 전달되는 알림 페이로드
 */
export type NotificationPayload = {
  id: number;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * 새 알림을 생성할 때 사용되는 타입
 */
export type CreateNotification = {
  userId: string;
  type: string;
  message: string;
};

/**
 * 알림 수정 시 사용할 타입 (Partial 적용)
 */
export type PatchNotification = Partial<CreateNotification>;

/**
 * Notification API 응답 타입
 */
export type NotificationResponse = Notification;
