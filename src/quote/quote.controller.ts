import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AlsStore } from '#common/als/store-validator.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { CreateQuoteDto, QueryQuoteDto, UpdateQuoteDto, UpdateQuoteStatusDto } from './dto/quote.dto.js';
import { QuoteService } from './quote.service.js';
import { CreateLessonQuote } from './type/quote.type.js';

@ApiTags('quotes')
@ApiBearerAuth()
@Controller('quotes')
export class QuoteController {
  constructor(
    private readonly quoteService: QuoteService,
    private readonly asStore: AlsStore,
  ) {}

  /*************************************************************************************
   * 레슨 견적 생성
   * ***********************************************************************************
   */
  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '레슨 견적 생성', description: '트레이너가 특정 레슨에 대해 견적을 제출합니다.' })
  @ApiResponse({
    status: 201,
    description: '견적 생성 성공',
    content: {
      'application/json': {
        example: {
          id: '87691494-80e4-475c-8bda-a87d6a7bf001',
          trainerId: '337fc386-d1a7-4430-a37d-9d1c5bdafd4d',
          lessonRequestId: '6c3e95d6-0786-4cfb-9501-354ab8d527f1',
          price: 200000,
          message: '견적 요청드립니다. 긍정적인 검토 부탁드립니다.',
          status: 'PENDING',
          rejectionReason: null,
          createdAt: '2025-01-14T02:20:19.471Z',
          updatedAt: '2025-01-14T02:20:19.471Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: '유효하지 않은 입력 값이거나 이미 제출된 견적이 있음' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 404, description: '레슨을 찾을 수 없음' })
  @ApiBody({ type: CreateQuoteDto, description: '견적 생성 데이터' })
  async create(@Body() body: CreateQuoteDto) {
    const { userId } = this.asStore.getStore();
    const data: CreateLessonQuote = { ...body, trainerId: userId };
    return this.quoteService.createLessonQuote(data);
  }

  /*************************************************************************************
   * 레슨 견적 목록 조회
   * ***********************************************************************************
   */
  @Get()
  @ApiOperation({
    summary: '레슨 견적 목록 조회',
    description: '필터링 조건을 사용하여 레슨 견적 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '견적 목록 조회 성공',
    schema: {
      example: {
        list: [
          {
            id: '87691494-80e4-475c-8bda-a87d6a7bf001',
            trainerId: '337fc386-d1a7-4430-a37d-9d1c5bdafd4d',
            lessonRequestId: '6c3e95d6-0786-4cfb-9501-354ab8d527f1',
            price: 200000,
            message: '견적 요청드립니다. 긍정적인 검토 부탁드립니다.',
            status: 'PENDING',
            rejectionReason: null,
            createdAt: '2025-01-14T02:20:19.471Z',
            updatedAt: '2025-01-14T02:20:19.471Z',
          },
        ],
        totalCount: 1,
        hasMore: false,
      },
    },
  })
  async getLessonQuotes(@Query() query: QueryQuoteDto) {
    return this.quoteService.getLessonQuotes(query);
  }

  /*************************************************************************************
   * 레슨 견적 상태 업데이트 (확정)
   * ***********************************************************************************
   */
  @Patch(':id/accept')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '레슨 견적 수락', description: '사용자가 받은 특정 견적을 수락합니다.' })
  @ApiResponse({
    status: 200,
    description: '레슨 견적 수락 성공',
    content: {
      'application/json': {
        example: {
          id: '87691494-80e4-475c-8bda-a87d6a7bf001',
          trainerId: '337fc386-d1a7-4430-a37d-9d1c5bdafd4d',
          lessonRequestId: '6c3e95d6-0786-4cfb-9501-354ab8d527f1',
          price: 200000,
          message: '견적 요청드립니다. 긍정적인 검토 부탁드립니다.',
          status: 'ACCEPTED',
          rejectionReason: null,
          createdAt: '2025-01-14T02:20:19.471Z',
          updatedAt: '2025-01-14T02:25:00.123Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: '이미 처리된 견적이거나 잘못된 상태' })
  @ApiResponse({ status: 403, description: '해당 견적을 수락할 권한 없음' })
  @ApiResponse({ status: 404, description: '견적을 찾을 수 없음' })
  @ApiParam({ name: 'id', description: '수락할 견적 ID', required: true })
  async acceptQuote(@Param('id') id: string) {
    return this.quoteService.acceptLessonQuote(id);
  }

  /*************************************************************************************
   * 레슨 견적 상태 업데이트 (반려)
   * ***********************************************************************************
   */
  @Patch(':id/reject')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '레슨 견적 반려', description: '사용자가 받은 특정 견적을 반려합니다.' })
  @ApiResponse({
    status: 200,
    description: '레슨 견적 반려 성공',
    content: {
      'application/json': {
        example: {
          id: '87691494-80e4-475c-8bda-a87d6a7bf001',
          trainerId: '337fc386-d1a7-4430-a37d-9d1c5bdafd4d',
          lessonRequestId: '6c3e95d6-0786-4cfb-9501-354ab8d527f1',
          price: 200000,
          message: '견적 요청드립니다. 긍정적인 검토 부탁드립니다.',
          status: 'REJECTED',
          rejectionReason: '다른 견적을 수락했습니다.',
          createdAt: '2025-01-14T02:20:19.471Z',
          updatedAt: '2025-01-14T02:30:00.123Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: '이미 처리된 견적이거나 잘못된 상태' })
  @ApiResponse({ status: 403, description: '해당 견적을 반려할 권한 없음' })
  @ApiResponse({ status: 404, description: '견적을 찾을 수 없음' })
  @ApiParam({ name: 'id', description: '반려할 견적 ID', required: true })
  async rejectQuote(@Param('id') id: string, @Body() body: UpdateQuoteStatusDto) {
    return this.quoteService.rejectLessonQuote(id, body.rejectionReason);
  }

  /*************************************************************************************
   * 리뷰 가능 견적 목록 조회
   * ***********************************************************************************
   */
  @Get('reviewable')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: '리뷰 가능 견적 목록 조회',
    description: '사용자가 리뷰를 작성할 수 있는 완료된 레슨의 견적 목록을 조회합니다.',
  })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호 (기본값: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: '페이지 당 항목 수 (기본값: 5)' })
  @ApiResponse({
    status: 200,
    description: '리뷰 가능 견적 목록 조회 성공',
    schema: {
      example: {
        list: [
          {
            id: 'a1b2c3d4-5678-9101-1121-3141a5b6c7d8',
            trainerId: '337fc386-d1a7-4430-a37d-9d1c5bdafd4d',
            lessonRequestId: '6c3e95d6-0786-4cfb-9501-354ab8d527f1',
            price: 150000,
            message: '완료된 레슨의 견적입니다.',
            status: 'ACCEPTED',
            rejectionReason: null,
            createdAt: '2025-01-14T02:20:19.471Z',
            updatedAt: '2025-01-20T10:15:30.123Z',
            lessonRequest: {
              id: '6c3e95d6-0786-4cfb-9501-354ab8d527f1',
              status: 'COMPLETED',
            },
            Review: [],
          },
        ],
        totalCount: 1,
        hasMore: false,
      },
    },
  })
  async getReviewableQuotes(@Query('page') page = 1, @Query('limit') limit = 5) {
    return this.quoteService.getReviewableQuotes(+page, +limit);
  }

  /*************************************************************************************
   * 레슨 견적 상세 조회
   * ***********************************************************************************
   */
  @Get(':id')
  @ApiOperation({
    summary: '레슨 견적 상세 조회',
    description: '특정 견적 ID로 레슨 견적 정보를 조회합니다.',
  })
  @ApiParam({ name: 'id', required: true, description: '견적 ID' })
  @ApiResponse({
    status: 200,
    description: '견적 상세 조회 성공',
    schema: {
      example: {
        id: '11g489c0-a951-44c4-8d52-bec26edf0bbe',
        trainerId: '11752641-132b-4ec3-ab67-bb2116cc3c94',
        lessonRequestId: '6ccfc386-d1a7-4430-a37d-9d1c5bdafd01',
        price: 110000,
        message: 'trainer01 견적 드립니다. 긍정적인 검토 부탁드립니다.',
        status: 'ACCEPTED',
        rejectionReason: null,
        createdAt: '2025-01-21T02:00:00.000Z',
        updatedAt: '2025-01-21T02:00:00.000Z',
        lessonRequest: {
          id: '6ccfc386-d1a7-4430-a37d-9d1c5bdafd01',
          userId: '699fc386-d1a7-4430-a37d-9d1c5bdafd3f',
          lessonType: 'FITNESS',
          lessonSubType: 'PILATES',
          startDate: '2025-01-24T01:00:00.000Z',
          endDate: '2025-01-28T09:00:00.000Z',
          lessonCount: 5,
          lessonTime: 40,
          quoteEndDate: '2025-01-23T14:59:59.000Z',
          locationType: 'OFFLINE',
          postcode: '13529',
          roadAddress: '경기 성남시 분당구 판교역로 166',
          detailAddress: '101호',
          status: 'COMPLETED',
          createdAt: '2025-01-20T00:00:00.000Z',
          updatedAt: '2025-01-23T15:00:00.000Z',
        },
        trainer: {
          id: '11752641-132b-4ec3-ab67-bb2116cc3c94',
          email: 'trainer01@example.com',
          nickname: 'trainer01',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: '견적을 찾을 수 없음' })
  async getLessonQuoteById(@Param('id') id: string) {
    return this.quoteService.getLessonQuoteById(id);
  }
}
