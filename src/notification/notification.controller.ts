import { Controller, Get, Param, Patch, Query, Sse, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { map, Observable, tap } from 'rxjs';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { logger } from '#logger/winston-logger.js';
import {
  NotificationListResponseDto,
  NotificationResponseDto,
  QueryNotificationDto,
} from './dto/notification.dto.js';
import { NotificationService } from './notification.service.js';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  /*************************************************************************************
   * 알림 목록 조회
   * ***********************************************************************************
   */
  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '알림 목록 조회',
    description: '현재 사용자의 알림 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '알림 목록 조회 성공', type: NotificationListResponseDto })
  async getNotifications(@Query() query: QueryNotificationDto) {
    return this.notificationService.getNotifications(query);
  }

  /*************************************************************************************
   * 알림 실시간 구독
   * ***********************************************************************************
   */

  @Sse('sse')
  @ApiOperation({
    summary: 'SSE 실시간 알림 구독',
    description: '사용자가 실시간으로 알림을 받을 수 있도록 SSE 연결을 제공합니다.',
  })
  @ApiQuery({ name: 'user_id', required: true, description: '사용자 ID' })
  @ApiProduces('text/event-stream')
  @ApiResponse({
    status: 200,
    description: 'SSE 연결 성공 (Swagger UI에서 직접 테스트할 수 없음)',
    schema: {
      example: `data: {"id":64,"userId":"777fc386-d1a7-4430-a37d-9d1c5bdafd5d","type":"LESSON_QUOTE","message":"user01님으로부터 레슨(피트니스)에 대한 지정 견적 요청이 도착했습니다.","isRead":false,"createdAt":"2025-02-14T14:10:05.458","updatedAt":"2025-02-14T14:10:05.458"}\n\n`,
    },
  })
  sse(@Query('user_id') userId: string): Observable<string> {
    const convertToKST = (dateString: string | null) => {
      if (!dateString) return null;

      // PostgreSQL에서 가져온 날짜 데이터가 'Z'를 포함하지 않는 경우 UTC 기준으로 처리되지 않을 수 있음.
      if (!dateString.endsWith('Z')) {
        dateString += 'Z';
      }

      const date = new Date(dateString);
      // UTC 기준 시간을 KST(한국 시간, UTC+9)로 변환하여 반환
      return new Date(date.getTime() + 9 * 60 * 60 * 1000)
        .toISOString()
        .replace('T', ' ') // 'T'를 공백으로 변경하여 가독성 향상
        .slice(0, 19); // 밀리초(.sss)와 'Z' 제거하여 'YYYY-MM-DD HH:mm:ss' 형식으로 변환
    };

    return this.notificationService.getUserNotificationStream(userId).pipe(
      tap((data) => {
        logger.debug(`SSE 응답 데이터:\n ${JSON.stringify(data, null, 2)}`);
      }),
      // createdAt, updatedAt을 한국 시간으로 변환
      map((data) => {
        return `${JSON.stringify({
          ...data,
          createdAt: convertToKST(data.createdAt),
          updatedAt: convertToKST(data.updatedAt),
        })}\n\n`; // SSE 표준 형식으로 변환
      }),
    );
  }

  /*************************************************************************************
   * 알림 읽음 처리 (토글됨)
   * ***********************************************************************************
   */
  @Patch(':notificationId/read')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '알림 읽음 처리',
    description: '특정 알림을 읽음 처리 합니다. 다시 보내면 읽지 않은 상태로 변경됩니다.',
  })
  @ApiResponse({ status: 200, description: '알림 읽음 처리 여부', type: NotificationResponseDto })
  async readNotification(@Param('notificationId') notificationId: number) {
    return this.notificationService.toggleNotificaitonRead(notificationId);
  }
}
