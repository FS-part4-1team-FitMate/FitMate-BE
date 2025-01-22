import { Injectable } from '@nestjs/common';
import { DirectQuoteRequest, DirectQuoteRequestStatus, LessonRequest, LessonRequestStatus, Prisma } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import { ILessonRepository } from './interface/lesson-repository.interface.js';
import { CreateLesson, LessonResponse, PatchLesson } from './type/lesson.type.js';

@Injectable()
export class LessonRepository implements ILessonRepository {
  private readonly lessonRequest;
  private readonly directQuoteRequest;
  constructor(private readonly prisma: PrismaService) {
    this.lessonRequest = prisma.lessonRequest;
    this.directQuoteRequest = prisma.directQuoteRequest;
  }

  async create(data: CreateLesson & { userId: string }): Promise<LessonRequest> {
    return await this.lessonRequest.create({ data });
  }

  async findAll(
    where: Record<string, any> = {},
    orderBy: Record<string, string> = { created_at: 'desc' },
    skip = 0,
    take = 10,
    select?: Prisma.LessonRequestSelect,
  ): Promise<LessonResponse[]> {
    const lessons = await this.lessonRequest.findMany({
      where,
      orderBy,
      skip,
      take,
      select,
    });
    return lessons;
  }

  async count(where: Record<string, any> = {}): Promise<number> {
    return await this.lessonRequest.count({
      where,
    });
  }

  async findLessonsByUserId(userId: string, status?: LessonRequestStatus): Promise<LessonRequest[]> {
    const whereClause: Prisma.LessonRequestWhereInput = { userId };
    if (status) {
      whereClause.status = status;
    }
    return await this.lessonRequest.findMany({ where: whereClause });
  }

  async findOne(id: string, select?: Prisma.LessonRequestSelect): Promise<LessonResponse | null> {
    const lesson = await this.lessonRequest.findUnique({ where: { id }, select });
    return lesson;
  }

  async updateStatus(id: string, status: LessonRequestStatus): Promise<LessonRequest> {
    return await this.lessonRequest.update({ where: { id }, data: { status } });
  }

  async update(id: string, data: PatchLesson): Promise<LessonRequest> {
    return await this.lessonRequest.update({ where: { id }, data });
  }

  async findDirectQuoteRequest(
    lessonRequestId: string,
    trainerId: string,
  ): Promise<DirectQuoteRequest | null> {
    return await this.directQuoteRequest.findUnique({
      where: {
        lessonRequestId_trainerId: {
          lessonRequestId,
          trainerId,
        },
      },
    });
  }

  // 지정 견적 요청 생성
  async createDirectQuoteRequest(data: {
    lessonRequestId: string;
    trainerId: string;
  }): Promise<DirectQuoteRequest> {
    return await this.directQuoteRequest.create({ data });
  }

  // 지정 견적 요청 반려를 위한 조회
  async findDirectQuoteRequestById(id: string): Promise<DirectQuoteRequest | null> {
    return await this.directQuoteRequest.findUnique({ where: { id } });
  }

  // 지정 견적 요청 반려
  async updateDirectQuoteRequest(
    id: string,
    data: { status: DirectQuoteRequestStatus; rejectionReason?: string },
  ): Promise<DirectQuoteRequest> {
    return await this.directQuoteRequest.update({ where: { id }, data });
  }

  /**
   * (where 조건 없이) 전체 레슨 데이터를 대상으로 lessonType을 groupBy
   */
  async groupByLessonTypeAll(): Promise<
    {
      lessonType: string; // 또는 LessonType
      count: number;
    }[]
  > {
    const results = await this.prisma.lessonRequest.groupBy({
      by: ['lessonType'],
      _count: {
        lessonType: true,
      },
      // where: {} ← 명시 안 하면 전체 레코드 대상
    });

    // 반환값을 { lessonType, count } 형태로 가공
    return results.map((item) => ({
      lessonType: item.lessonType,
      count: item._count.lessonType,
    }));
  }

  // 남/여 카운트 계산을 위한 조회회
  async findAllForGenderCount() {
    return this.prisma.lessonRequest.findMany({
      select: {
        id: true,
        user: {
          select: {
            profile: {
              select: {
                gender: true,
              },
            },
          },
        },
        directQuoteRequests: {
          select: {
            trainerId: true, // 트레이너 ID만 필요
          },
        },
      },
    });
  }
}
