import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';
import { LessonService } from './lesson.service.js';
import { logger } from '#logger/winston-logger.js';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  async create(@Body() createLessonDto: CreateLessonDto) {
    logger.warn('createLessonDto', createLessonDto);
    const userId = '699fc386-d1a7-4430-a37d-9d1c5bdafd3f';
    return this.lessonService.createLesson(createLessonDto, userId);
  }

  @Get()
  async findAll() {
    return this.lessonService.getLessons();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.lessonService.getLessonById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonService.updateLessonById(id, updateLessonDto);
  }
}
