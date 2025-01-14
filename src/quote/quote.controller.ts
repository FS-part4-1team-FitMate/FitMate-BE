import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { AlsStore } from '#common/als/store-validator.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { CreateQuoteDto, UpdateQuoteDto, UpdateQuoteStatusDto } from './dto/quote.dto.js';
import { QuoteService } from './quote.service.js';

@Controller('quotes')
export class QuoteController {
  constructor(
    private readonly quoteService: QuoteService,
    private readonly alsStore: AlsStore,
  ) {}

  /*************************************************************************************
   * 레슨 견적 생성
   * ***********************************************************************************
   */
  @Post()
  @UseGuards(AccessTokenGuard)
  async create(@Body() body: CreateQuoteDto) {
    const { userId, userRole } = this.alsStore.getStore();
    return this.quoteService.createLessonQuote({ ...body, trainerId: userId }, userRole);
  }

  /*************************************************************************************
   * 레슨 견적 상태 업데이트 (확정)
   * ***********************************************************************************
   */
  @Patch(':id/accept')
  @UseGuards(AccessTokenGuard)
  async acceptQuote(@Param('id') id: string) {
    const { userId } = this.alsStore.getStore();
    return this.quoteService.acceptLessonQuote(id, userId);
  }

  /*************************************************************************************
   * 레슨 견적 상태 업데이트 (반려)
   * ***********************************************************************************
   */
  @Patch(':id/reject')
  @UseGuards(AccessTokenGuard)
  async rejectQuote(@Param('id') id: string, @Body() body: UpdateQuoteStatusDto) {
    const { userId } = this.alsStore.getStore();
    return this.quoteService.rejectLessonQuote(id, userId, body.rejectionReason);
  }

  /*************************************************************************************
   * 레슨 견적 목록 조회
   * ***********************************************************************************
   */
  @Get()
  async getLessonQuotes() {
    return this.quoteService.getLessonQuotes();
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
