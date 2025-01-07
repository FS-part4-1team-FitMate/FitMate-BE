import { Injectable } from '@nestjs/common';
import { LessonRequestStatus } from '@prisma/client';
import { BadRequestException, UserNotFoundException } from '#exception/http-exception.js';
import { UserRepository } from '#user/user.repository.js';
import { logger } from '#logger/winston-logger.js';
import { ILessonService } from './interface/lesson-service.interface.js';
import { LessonRepository } from './lesson.repository.js';
import { CreateLesson, LessonResponse, PatchLesson } from './type/lesson.type.js';

@Injectable()
export class LessonService implements ILessonService {
  constructor(
    private readonly lessonRepository: LessonRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createLesson(data: CreateLesson, userId: string): Promise<LessonResponse> {
    const userExists = await this.userRepository.findUserById(userId);
    if (!userExists) {
      logger.warn(`User not found: ${userId}`);
      throw new UserNotFoundException();
    }
    logger.debug('sevice data: ', data);

    return this.lessonRepository.create({ ...data, userId });
  }

  async getLessonById(id: string): Promise<LessonResponse | null> {
    return this.lessonRepository.findOne(id);
  }

  async updateLessonById(id: string, data: PatchLesson): Promise<LessonResponse | null> {
    return this.lessonRepository.update(id, data);
  }

  async getLessons(): Promise<{ list: LessonResponse[]; totalCount: number; hasMore: boolean }> {
    const lessons = await this.lessonRepository.findAll();
    const totalCount = lessons.length;
    return {
      list: lessons,
      totalCount,
      hasMore: false,
    };
  }

  async updateLessonStatus(id: string, status: LessonRequestStatus): Promise<LessonResponse | null> {
    return this.lessonRepository.updateStatus(id, status);
  }
}
