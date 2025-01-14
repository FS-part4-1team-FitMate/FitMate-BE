import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { AlsStore } from '#common/als/store-validator.js';
import { UUIDPipe } from '#common/uuid.pipe.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { CreateLessonDto, QueryLessonDto } from './dto/lesson.dto.js';
import { LessonService } from './lesson.service.js';

@Controller('lessons')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly alsStore: AlsStore,
  ) {}

  /*************************************************************************************
   * 요청 레슨 생성
   * ***********************************************************************************
   */
  @Post()
  @UseGuards(AccessTokenGuard)
  async create(@Body() body: CreateLessonDto) {
    const { userId, userRole } = this.alsStore.getStore();
    return this.lessonService.createLesson(body, userId, userRole);
  }

  /*************************************************************************************
   * 요청 레슨 목록 조회
   * ***********************************************************************************
   */
  @Get()
  async getLessons(@Query() query: QueryLessonDto) {
    return this.lessonService.getLessons(query);
  }

  /*************************************************************************************
   * 나의 요청 레슨 목록 조회
   * ***********************************************************************************
   */
  @Get('me')
  @UseGuards(AccessTokenGuard)
  async getMyLessons(@Query() query: QueryLessonDto) {
    const { userId } = this.alsStore.getStore();
    return this.lessonService.getLessons(query, userId);
  }

  /*************************************************************************************
   * 요청 레슨 상세조회
   * ***********************************************************************************
   */
  @Get(':id')
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
    const { userId } = this.alsStore.getStore();
    return this.lessonService.cancelLessonById(id, userId);
  }
}
