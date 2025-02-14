import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { setHours, setMinutes, setSeconds, subDays } from 'date-fns';
import { UUIDPipe } from '#common/uuid.pipe.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import {
  CreateDirectQuoteDto,
  CreateLessonDto,
  QueryLessonDto,
  RejectDirectQuoteDto,
} from './dto/lesson.dto.js';
import { LessonService } from './lesson.service.js';

@ApiTags('lessons')
@ApiBearerAuth()
@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  /*************************************************************************************
   * 요청 레슨 생성
   * ***********************************************************************************
   */
  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '요청 레슨 등록', description: '새로운 요청 레슨을 등록합니다.' })
  @ApiResponse({ status: 400, description: '유효성 검사 실패 또는 잘못된 요청 데이터' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiCreatedResponse({
    description: '레슨이 정상적으로 생성됨',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        lessonType: 'SPORTS',
        lessonSubType: 'YOGA',
        startDate: '2025-01-01T09:00:00.000Z',
        endDate: '2025-02-01T09:00:00.000Z',
        lessonCount: 3,
        lessonTime: 24,
        quoteEndDate: '2024-01-24T23:59:59.000Z',
        locationType: 'OFFLINE',
        postcode: '12345',
        roadAddress: '서울특별시 강남구 역삼동 ...',
        detailAddress: '101동 101호',
        userId: 'user-uuid-123',
        status: 'PENDING',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    },
  })
  async create(@Body() body: CreateLessonDto) {
    const startDate = new Date(body.startDate);

    // quoteEndDate를 startDate 하루 전날 23:59:59 설정
    const quoteEndDate = setSeconds(setMinutes(setHours(subDays(startDate, 1), 23), 59), 59);

    return this.lessonService.createLesson({ ...body, quoteEndDate: quoteEndDate });
  }

  /*************************************************************************************
   * 요청 레슨 목록 조회
   * ***********************************************************************************
   */
  @Get()
  @UseGuards(AccessTokenGuard) // 지정 견적 요청을 구분하기 위해
  @ApiOperation({
    summary: '요청 레슨 목록 조회',
    description: '검색/필터링을 바탕으로 레슨 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '레슨 목록 조회 성공',
    content: {
      'application/json': {
        example: {
          list: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              lessonType: 'SPORTS',
              lessonSubType: 'YOGA',
              startDate: '2025-01-01T09:00:00.000Z',
              endDate: '2025-02-01T09:00:00.000Z',
              lessonCount: 3,
              lessonTime: 24,
              locationType: 'OFFLINE',
              postcode: '12345',
              roadAddress: '서울특별시 강남구 역삼동 ...',
              detailAddress: '101동 101호',
              user: {
                id: 'user-uuid-123',
                nickname: '남하늘',
                profile: {
                  name: '김철수',
                  gender: 'MALE',
                  region: ['SEOUL'],
                },
              },
              status: 'PENDING',
              createdAt: '2025-01-01T00:00:00.000Z',
              updatedAt: '2025-01-01T00:00:00.000Z',
              isDirectQuote: false,
            },
          ],
          totalCount: 1,
          hasMore: false,
          lessonTypeCounts: { SPORTS: 1, FITNESS: 0, REHAB: 0 },
          genderCounts: { male: 1, female: 0 },
          directQuoteRequestCount: 0,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async getLessons(@Query() query: QueryLessonDto) {
    return this.lessonService.getLessons(query);
  }

  /*************************************************************************************
   * 나의 요청 레슨 목록 조회 (요청 레슨 등록한 사람 기준)
   * ***********************************************************************************
   */
  @Get('me')
  @UseGuards(AccessTokenGuard) // 요청 레슨 등록한 유저 구분하기 위해
  @ApiOperation({
    summary: '나의 요청 레슨 목록 조회',
    description: '나의 요청 레슨 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '나의 레슨 목록 조회 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async getMyLessons(@Query() query: QueryLessonDto) {
    return this.lessonService.getMyLessons(query);
  }

  /*************************************************************************************
   * 요청 레슨 상세조회
   * ***********************************************************************************
   */
  @Get(':id')
  @UseGuards(AccessTokenGuard) // 지정 견적 요청을 구분하기 위해
  @ApiOperation({ summary: '요청 레슨 상세 조회', description: '요청 레슨 상세 정보를 조회합니다.' })
  @ApiResponse({
    status: 200,
    description: '레슨 상세 조회 성공',
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          lessonType: 'FITNESS',
          lessonSubType: 'YOGA',
          startDate: '2025-01-02T09:00:00.000Z',
          endDate: '2025-02-01T09:00:00.000Z',
          lessonCount: 3,
          lessonTime: 24,
          quoteEndDate: '2024-01-01T23:59:59.000Z',
          locationType: 'OFFLINE',
          postcode: '12345',
          roadAddress: '서울특별시 강남구 역삼동 ...',
          detailAddress: '101동 101호',
          status: 'PENDING',
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
          directQuoteRequests: [
            {
              id: 'quote-uuid-456',
              lessonRequestId: '123e4567-e89b-12d3-a456-426614174000',
              trainerId: 'trainer-uuid-789',
              status: 'PENDING',
              rejectionReason: null,
            },
          ],
          lessonQuotes: [
            {
              id: 'quote-uuid-789',
              trainerId: 'trainer-uuid-001',
              lessonRequestId: '123e4567-e89b-12d3-a456-426614174000',
              price: 50000,
              messeage: '안녕하세요! 요가 강사입니다.',
              status: 'PENDING',
              rejectionReason: null,
              trainer: {
                id: 'trainer-uuid-001',
                nickname: '박지성',
                profile: {
                  name: '박지성',
                  region: ['GYEONGGI'],
                },
              },
            },
          ],
          user: {
            id: 'user-uuid-123',
            nickname: '스카이블루루',
            profile: {
              name: '남하늘',
              gender: 'MALE',
              region: ['SEOUL'],
            },
          },
          isDirectQuote: false,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 404, description: '레슨을 찾을 수 없음' })
  async findOne(@Param('id', UUIDPipe) id: string) {
    return this.lessonService.getLessonById(id);
  }

  /*************************************************************************************
   * 요청 레슨 취소
   * ***********************************************************************************
   */
  @Patch(':id/cancel')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '요청 레슨 취소', description: '요청 레슨을 취소합니다.' })
  @ApiResponse({ status: 200, description: '레슨 취소 성공' })
  @ApiResponse({ status: 400, description: '취소 불가능한 상태이거나 잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 404, description: '레슨을 찾을 수 없음' })
  async cancelLesson(@Param('id', UUIDPipe) id: string) {
    return this.lessonService.cancelLessonById(id);
  }

  /*************************************************************************************
   * 내가 생성한 요청 레슨에 대해 지정 견적 요청 생성
   * ***********************************************************************************
   */
  @Post(':id/direct-quote')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: '지정 견적 요청 생성',
    description: '내가 생성한 요청 레슨에 대해 특정 트레이너에게 견적 요청을 보냅니다.',
  })
  @ApiCreatedResponse({
    description: '지정 견적 요청 생성 성공',
    content: {
      'application/json': {
        example: {
          id: 'dqr-uuid-123456',
          lessonRequestId: 'lesson-uuid-123',
          trainerId: 'trainer-uuid-456',
          status: 'PENDING',
          rejectionReason: null,
          createdAt: '2025-01-01T10:00:00.000Z',
        },
      },
    },
  })
  async createDirectQuote(@Param('id', UUIDPipe) lessonId: string, @Body() body: CreateDirectQuoteDto) {
    return this.lessonService.createDirectQuoteRequest(lessonId, body);
  }
  /*************************************************************************************
   * 지정 견적 요청에 대한 반려
   * ***********************************************************************************
   */
  @Patch(':lessonId/direct_quote/:directQuoteRequestId/reject')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: '지정 견적 요청 반려',
    description: '트레이너가 받은 지정 견적 요청을 반려합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '지정 견적 요청 반려 성공',
  })
  @ApiResponse({
    status: 400,
    description: '반려 불가능한 상태이거나 잘못된 요청',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 또는 권한 없음',
  })
  @ApiResponse({
    status: 404,
    description: '견적 요청을 찾을 수 없음',
  })
  async rejectDirectQuoteRequest(
    @Param('lessonId', UUIDPipe) lessonId: string,
    @Param('directQuoteRequestId', UUIDPipe) directQuoteRequestId: string,
    @Body() body: RejectDirectQuoteDto,
  ) {
    return this.lessonService.rejectDirectQuoteRequest(lessonId, directQuoteRequestId, body);
  }
}
