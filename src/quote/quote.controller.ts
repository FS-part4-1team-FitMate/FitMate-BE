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
import {
  CreateQuoteDto,
  QueryQuoteDto,
  QuoteListResponseDto,
  QuoteResponseDto,
  ReviewableQuoteListResponseDto,
  UpdateQuoteStatusDto,
} from './dto/quote.dto.js';
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
  @ApiResponse({ status: 201, description: '견적 생성 성공', type: QuoteResponseDto })
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
    type: QuoteListResponseDto,
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
  @ApiResponse({ status: 200, description: '레슨 견적 수락 성공', type: QuoteResponseDto })
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
  @ApiResponse({ status: 200, description: '레슨 견적 반려 성공', type: QuoteResponseDto })
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
    type: ReviewableQuoteListResponseDto,
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
  @ApiResponse({ status: 200, description: ' 견적 상세 조회 성공', type: QuoteResponseDto })
  @ApiResponse({ status: 404, description: '견적을 찾을 수 없음' })
  async getLessonQuoteById(@Param('id') id: string) {
    return this.quoteService.getLessonQuoteById(id);
  }
}
