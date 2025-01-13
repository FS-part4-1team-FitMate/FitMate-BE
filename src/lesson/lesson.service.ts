import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LessonRequestStatus } from '@prisma/client';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import LessonExceptionMessage from '#exception/lesson-exception-message.js';
import { UserRepository } from '#user/user.repository.js';
import { QueryLessonDto } from './dto/lesson.dto.js';
import { ILessonService } from './interface/lesson-service.interface.js';
import { LessonRepository } from './lesson.repository.js';
import { CreateLesson, LessonResponse, PatchLesson } from './type/lesson.type.js';

@Injectable()
export class LessonService implements ILessonService {
  constructor(
    private readonly lessonRepository: LessonRepository,
    private readonly userRepository: UserRepository,
  ) {}

  /*************************************************************************************
   * 요청 레슨 생성
   * ***********************************************************************************
   */
  async createLesson(data: CreateLesson, userId: string, userRole: string): Promise<LessonResponse> {
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }
    if (userRole !== 'USER') {
      throw new UnauthorizedException(LessonExceptionMessage.ONLY_USER_CAN_REQUEST_LESSON);
    }
    const userExists = await this.userRepository.findUserById(userId);
    if (!userExists) {
      throw new NotFoundException(AuthExceptionMessage.USER_NOT_FOUND);
    }

    const pendingLesson = await this.lessonRepository.findLessonsByUserId(
      userId,
      LessonRequestStatus.PENDING,
    );
    if (pendingLesson.length > 0) {
      throw new BadRequestException(LessonExceptionMessage.PENDING_LESSON_EXISTS);
    }

    return await this.lessonRepository.create({ ...data, userId });
  }

  /*************************************************************************************
   * 요청 레슨 목록 조회 (나의 요청 레슨 공통 조회)
   * ***********************************************************************************
   */
  async getLessons(
    query: QueryLessonDto,
    userId?: string,
  ): Promise<{ list: LessonResponse[]; totalCount: number; hasMore: boolean }> {
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }

    const {
      page = 1,
      limit = 5,
      order = 'created_at',
      sort = 'desc',
      keyword,
      lessonType,
      lessonSubType,
      locationType,
      status,
    } = query.toCamelCase();

    const orderMapping: Record<string, string> = {
      created_at: 'createdAt',
      start_date: 'startDate',
      end_date: 'endDate',
      quote_end_date: 'quoteEndDate',
      rating: 'rating',
      lesson_count: 'lessonCount',
      lesson_time: 'lessonTime',
    };

    const orderByField = orderMapping[order] || 'createdAt';

    // 필터 조건 구성
    const where = {
      ...(userId && { userId }),
      ...(lessonType && { lessonType: { in: lessonType } }),
      ...(lessonSubType && { lessonSubType: { in: lessonSubType } }),
      ...(locationType && { locationType: { in: locationType } }),
      ...(status && { status: { in: status } }),
      ...(keyword && {
        OR: [{ roadAddress: { contains: keyword } }, { detailAddress: { contains: keyword } }],
      }),
    };

    const orderBy: Record<string, string> = {};
    orderBy[orderByField] = sort;
    const skip = (page - 1) * limit;
    const take = limit;

    const [lessons, totalCount] = await Promise.all([
      this.lessonRepository.findAll(where, orderBy, skip, take),
      this.lessonRepository.count(where),
    ]);

    return {
      list: lessons,
      totalCount,
      hasMore: totalCount > page * limit,
    };
  }

  /*************************************************************************************
   * 요청 레슨 상세조회
   * ***********************************************************************************
   */
  async getLessonById(id: string): Promise<LessonResponse> {
    const lesson = await this.lessonRepository.findOne(id);
    if (!lesson) {
      throw new NotFoundException(LessonExceptionMessage.LESSON_NOT_FOUND);
    }
    return lesson;
  }

  /*************************************************************************************
   * 요청 레슨 취소
   * ***********************************************************************************
   */
  async cancelLessonById(lessonId: string, userId: string): Promise<LessonResponse> {
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }

    const lesson = await this.lessonRepository.findOne(lessonId);

    if (!lesson) {
      throw new NotFoundException(LessonExceptionMessage.LESSON_NOT_FOUND);
    }

    if (lesson.userId !== userId) {
      throw new UnauthorizedException(LessonExceptionMessage.NOT_MY_LESSON);
    }

    if (lesson.status !== LessonRequestStatus.PENDING) {
      throw new BadRequestException(LessonExceptionMessage.INVALID_STATUS_TOBE_PENDING);
    }

    return await this.lessonRepository.updateStatus(lessonId, LessonRequestStatus.CANCELED);
  }

  async updateLessonById(id: string, data: PatchLesson): Promise<LessonResponse> {
    return await this.lessonRepository.update(id, data);
  }

  async updateLessonStatus(id: string, status: LessonRequestStatus): Promise<LessonResponse> {
    return await this.lessonRepository.updateStatus(id, status);
  }
}
