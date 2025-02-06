import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { AlsStore } from '#common/als/store-validator.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { CreateQuoteDto, QueryQuoteDto, UpdateQuoteDto, UpdateQuoteStatusDto } from './dto/quote.dto.js';
import { QuoteService } from './quote.service.js';
import { CreateLessonQuote } from './type/quote.type.js';

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
  async create(@Body() body: CreateQuoteDto) {
    const { userId } = this.asStore.getStore();
    const data: CreateLessonQuote = { ...body, trainerId: userId };
    return this.quoteService.createLessonQuote(data);
  }

  /*************************************************************************************
   * 레슨 견적 상태 업데이트 (확정)
   * ***********************************************************************************
   */
  @Patch(':id/accept')
  @UseGuards(AccessTokenGuard)
  async acceptQuote(@Param('id') id: string) {
    return this.quoteService.acceptLessonQuote(id);
  }

  /*************************************************************************************
   * 레슨 견적 상태 업데이트 (반려)
   * ***********************************************************************************
   */
  @Patch(':id/reject')
  @UseGuards(AccessTokenGuard)
  async rejectQuote(@Param('id') id: string, @Body() body: UpdateQuoteStatusDto) {
    return this.quoteService.rejectLessonQuote(id, body.rejectionReason);
  }

  /*************************************************************************************
   * 레슨 견적 목록 조회
   * ***********************************************************************************
   */
  @Get()
  async getLessonQuotes(@Query() query: QueryQuoteDto) {
    return this.quoteService.getLessonQuotes(query);
  }

  /*************************************************************************************
   * 리뷰 가능 견적 목록 조회
   * ***********************************************************************************
   */
  @Get('reviewable')
  @UseGuards(AccessTokenGuard)
  async getReviewableQuotes(@Query('page') page = 1, @Query('limit') limit = 5) {
    return this.quoteService.getReviewableQuotes(+page, +limit);
  }

  /*************************************************************************************
   * 레슨 견적 상세 조회
   * ***********************************************************************************
   */
  @Get(':id')
  async getLessonQuoteById(@Param('id') id: string) {
    return this.quoteService.getLessonQuoteById(id);
  }

  /*************************************************************************************
   * 레슨 견적 내용 수정
   * ***********************************************************************************
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateQuoteDto) {
    return this.quoteService.updateLessonQuote(id, body);
  }
}
