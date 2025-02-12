import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
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

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  /*************************************************************************************
   * 요청 레슨 생성
   * ***********************************************************************************
   */
  @Post()
  @UseGuards(AccessTokenGuard)
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
  async getLessons(@Query() query: QueryLessonDto) {
    return this.lessonService.getLessons(query);
  }

  /*************************************************************************************
   * 나의 요청 레슨 목록 조회 (요청 레슨 등록한 사람 기준)
   * ***********************************************************************************
   */
  @Get('me')
  @UseGuards(AccessTokenGuard) // 요청 레슨 등록한 유저 구분하기 위해
  async getMyLessons(@Query() query: QueryLessonDto) {
    return this.lessonService.getMyLessons(query);
  }

  /*************************************************************************************
   * 요청 레슨 상세조회
   * ***********************************************************************************
   */
  @Get(':id')
  @UseGuards(AccessTokenGuard) // 지정 견적 요청을 구분하기 위해
  async findOne(@Param('id', UUIDPipe) id: string) {
    return this.lessonService.getLessonById(id);
  }

  /*************************************************************************************
   * 요청 레슨 취소
   * ***********************************************************************************
   */
  @Patch(':id/cancel')
  @UseGuards(AccessTokenGuard)
  async cancelLesson(@Param('id', UUIDPipe) id: string) {
    return this.lessonService.cancelLessonById(id);
  }

  /*************************************************************************************
   * 내가 생성한 요청 레슨에 대해 지정 견적 요청 생성
   * ***********************************************************************************
   */
  @Post(':id/direct-quote')
  @UseGuards(AccessTokenGuard)
  async createDirectQuote(@Param('id', UUIDPipe) lessonId: string, @Body() body: CreateDirectQuoteDto) {
    return this.lessonService.createDirectQuoteRequest(lessonId, body);
  }
  /*************************************************************************************
   * 지정 견적 요청에 대한 반려
   * ***********************************************************************************
   */
  @Patch(':lessonId/direct_quote/:directQuoteRequestId/reject')
  @UseGuards(AccessTokenGuard)
  async rejectDirectQuoteRequest(
    @Param('lessonId', UUIDPipe) lessonId: string,
    @Param('directQuoteRequestId', UUIDPipe) directQuoteRequestId: string,
    @Body() body: RejectDirectQuoteDto,
  ) {
    return this.lessonService.rejectDirectQuoteRequest(lessonId, directQuoteRequestId, body);
  }
}
