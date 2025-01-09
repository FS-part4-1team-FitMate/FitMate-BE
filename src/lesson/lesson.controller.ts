import { Controller, Get, Post, Body, Patch, Param, UseGuards, UnauthorizedException, Query } from '@nestjs/common';
import { AlsStore } from '#common/als/store-validator.js';
import { UUIDPipe } from '#common/uuid.pipe.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { CreateLessonDto, QueryLessonDto, UpdateLessonDto } from './dto/lesson.dto.js';
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
    if (!userId) {
      throw new UnauthorizedException('인증 정보가 유효하지 않습니다. 다시 로그인해 주세요'); // 추후 수정
    }
    if (userRole !== 'USER') {
      throw new UnauthorizedException('일반 유저인 경우에만 레슨을 요청하실 수 있습니다.'); // 추후 수정
    }
    return this.lessonService.createLesson(body, userId);
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
    if (!userId) {
      throw new UnauthorizedException('인증 정보가 유효하지 않습니다. 다시 로그인해 주세요'); // 추후 수정
    }
    return this.lessonService.cancelLessonById(id, userId);
  }

  /*************************************************************************************
   * 요청 레슨 목록 조회
   * ***********************************************************************************
   */
  @Get()
  async getLessons(@Query() query: QueryLessonDto) {
    return this.lessonService.getLessons(query);
  }

  @Patch(':id')
  async update(@Param('id', UUIDPipe) id: string, @Body() body: UpdateLessonDto) {
    return this.lessonService.updateLessonById(id, body);
  }
}
