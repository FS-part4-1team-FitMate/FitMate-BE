import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UUIDPipe } from '#common/uuid.pipe.js';
import { logger } from '#logger/winston-logger.js';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto.js';
import { LessonService } from './lesson.service.js';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  async create(@Body() body: CreateLessonDto) {
    logger.debug('createLessonDto: ', body);
    const userId = 'd8432ce7-3b03-46d9-8d19-16b7673c1fac';
    return this.lessonService.createLesson(body, userId);
  }

  @Get()
  async findAll() {
    return this.lessonService.getLessons();
  }

  @Get(':id')
  async findOne(@Param('id', UUIDPipe) id: string) {
    return this.lessonService.getLessonById(id);
  }

  @Patch(':id')
  async update(@Param('id', UUIDPipe) id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonService.updateLessonById(id, updateLessonDto);
  }
}
