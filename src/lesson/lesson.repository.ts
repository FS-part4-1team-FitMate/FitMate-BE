import { Injectable } from '@nestjs/common';
import type { DirectQuoteRequest, LessonRequest, LessonSubType } from '@prisma/client';
import { DirectQuoteRequestStatus, LessonRequestStatus, Prisma, Region } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import { getTodayRange } from '#utils/date.util.js';
import { QueryLessonDto } from './dto/lesson.dto.js';
import type { ILessonRepository } from './interface/lesson-repository.interface.js';
import type { CreateLesson, LessonResponse, PatchLesson } from './type/lesson.type.js';

@Injectable()
export class LessonRepository implements ILessonRepository {
  private readonly lessonRequest;
  private readonly directQuoteRequest;
  constructor(private readonly prisma: PrismaService) {
    this.lessonRequest = prisma.lessonRequest;
    this.directQuoteRequest = prisma.directQuoteRequest;
  }

  private regionMapping: Record<Region, string[]> = {
    SEOUL: ['서울'],
    GYEONGGI: ['경기'],
    INCHEON: ['인천'],
    GANGWON: ['강원', '강원특별자치도'],
    CHUNGBUK: ['충북'],
    CHUNGNAM: ['충남'],
    JEONBUK: ['전북', '전북특별자치도'],
    JEONNAM: ['전남'],
    GYEONGBUK: ['경북'],
    GYEONGNAM: ['경남'],
    DAEGU: ['대구'],
    DAEJEON: ['대전'],
    BUSAN: ['부산'],
    ULSAN: ['울산'],
    GWANGJU: ['광주'],
    JEJU: ['제주', '제주특별자치도'],
  };

  private orderMapping: Record<string, string> = {
    created_at: 'createdAt',
    start_date: 'startDate',
    end_date: 'endDate',
    quote_end_date: 'quoteEndDate',
    rating: 'rating',
    lesson_count: 'lessonCount',
    lesson_time: 'lessonTime',
  };

  async create(data: CreateLesson & { userId: string }): Promise<LessonRequest> {
    return await this.lessonRequest.create({ data });
  }

  async findLessons(
    query: QueryLessonDto,
    currentUserId: string,
    myLessonUserId?: string,
  ): Promise<{ lessons: LessonResponse[]; totalCount: number; hasMore: boolean }> {
    const {
      page = 1,
      limit = 5,
      order = 'createdAt',
      sort = 'desc',
      keyword,
      lessonType,
      lessonSubType,
      locationType,
      status,
      gender,
      region,
      hasDirectQuote,
    } = query.toCamelCase();

    // 필터(where) 조건 구성
    const where: Prisma.LessonRequestWhereInput = {
      ...(myLessonUserId && { userId: myLessonUserId }),
      ...(lessonType && { lessonType: { in: lessonType } }),
      ...(lessonSubType && { lessonSubType: { in: lessonSubType } }),
      ...(locationType && { locationType: { in: locationType } }),
      ...(status && { status: { in: status } }),
      ...(gender && {
        user: {
          is: {
            profile: {
              is: {
                gender: { in: gender },
              },
            },
          },
        },
      }),
      ...(hasDirectQuote !== undefined && {
        directQuoteRequests: hasDirectQuote
          ? { some: { trainerId: currentUserId } }
          : { none: { trainerId: currentUserId } },
      }),
      AND: [
        // region 필터
        ...(region
          ? [
              {
                OR: region.flatMap(
                  (r) =>
                    this.regionMapping[r]?.map((koreanRegion) => ({
                      roadAddress: { contains: koreanRegion },
                    })) || [],
                ),
              },
            ]
          : []),

        ...(keyword
          ? [
              {
                OR: [
                  // nickname 검색
                  {
                    user: {
                      is: {
                        nickname: {
                          contains: keyword,
                          mode: Prisma.QueryMode.insensitive,
                        },
                      },
                    },
                  },
                  // profile.name 검색
                  {
                    user: {
                      is: {
                        profile: {
                          is: {
                            name: {
                              contains: keyword,
                              mode: Prisma.QueryMode.insensitive,
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            ]
          : []),
      ],
    };

    const orderByField = this.orderMapping[order] || 'createdAt';
    const orderBy: Record<string, any> = {};
    orderBy[orderByField] = sort;

    const skip = (page - 1) * limit;
    const take = limit;

    const [lessons, totalCount] = await Promise.all([
      this.lessonRequest.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          directQuoteRequests: {
            select: {
              id: true,
              lessonRequestId: true,
              trainerId: true,
              status: true,
              rejectionReason: true,
            },
          },
          lessonQuotes: {
            include: {
              trainer: {
                select: {
                  id: true,
                  nickname: true,
                  profile: {
                    select: {
                      name: true,
                      region: true,
                    },
                  },
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              nickname: true,
              profile: {
                select: {
                  name: true,
                  gender: true,
                  region: true,
                },
              },
            },
          },
        },
      }),
      this.lessonRequest.count({ where }),
    ]);

    const hasMore = totalCount > page * limit;

    return { lessons, totalCount, hasMore };
  }

  async findLessonsByUserId(userId: string, status?: LessonRequestStatus): Promise<LessonRequest[]> {
    const whereClause: Prisma.LessonRequestWhereInput = { userId };
    if (status) {
      whereClause.status = status;
    }
    return await this.lessonRequest.findMany({ where: whereClause });
  }

  async findOneById(id: string): Promise<LessonResponse | null> {
    return this.lessonRequest.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        lessonType: true,
        lessonSubType: true,
        startDate: true,
        endDate: true,
        lessonCount: true,
        lessonTime: true,
        quoteEndDate: true,
        locationType: true,
        postcode: true,
        roadAddress: true,
        detailAddress: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        directQuoteRequests: {
          select: {
            trainerId: true,
          },
        },
        user: {
          select: {
            id: true,
            nickname: true,
            profile: {
              select: {
                name: true,
                gender: true,
                region: true,
              },
            },
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: LessonRequestStatus): Promise<LessonRequest> {
    return await this.lessonRequest.update({ where: { id }, data: { status } });
  }

  async updateLessonStatustWithTx(
    tx: Prisma.TransactionClient,
    lessonRequestId: string,
    status: LessonRequestStatus,
  ): Promise<void> {
    await tx.lessonRequest.update({
      where: { id: lessonRequestId },
      data: { status },
    });
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

  // 남/여 카운트 계산을 위한 조회
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

  async findDirectQuoteRequestByLessonId(lessonId: string): Promise<DirectQuoteRequest[]> {
    return await this.directQuoteRequest.findMany({
      where: { lessonRequestId: lessonId },
    });
  }

  /**
   * lesson-scheduler.service.ts에서 사용
   * 현재 시간(now) 기준으로 quoteEndDate가 지난 PENDING 상태의 LessonRequest를 EXPIRED로 업데이트합니다.
   */
  async updateExpiredLesson(now: Date): Promise<{ count: number }> {
    return await this.lessonRequest.updateMany({
      where: {
        status: 'PENDING',
        quoteEndDate: { lt: now },
      },
      data: { status: 'EXPIRED' },
    });
  }

  /**
   * lesson-scheduler.service.ts에서 사용
   * 현재 시간(now) 기준으로 endDate가 지난 QUOTE_CONFIRMED 상태의 LessonRequest를 COMPLETED로 업데이트합니다.
   */
  async updateCompletedLesson(now: Date): Promise<{ count: number }> {
    return await this.lessonRequest.updateMany({
      where: {
        status: 'QUOTE_CONFIRMED',
        endDate: { lt: now },
      },
      data: { status: 'COMPLETED' },
    });
  }
  /**
   * lesson-scheduler.service.ts에서 사용
   * 오늘 시작하는 레슨을 조회하고, 해당하는 트레이너 ID를 포함
   */
  async findLessonsStartingToday(now: Date): Promise<
    Array<{
      id: string;
      userId: string;
      nickname: string;
      lessonSubType: LessonSubType | null;
      trainerId: string | null;
    }>
  > {
    const { startOfDay, endOfDay } = getTodayRange(now);

    const lessons = await this.lessonRequest.findMany({
      where: {
        status: 'QUOTE_CONFIRMED',
        startDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      select: {
        id: true,
        userId: true,
        lessonSubType: true,
        user: {
          select: {
            nickname: true,
          },
        },
        lessonQuotes: {
          where: { status: 'ACCEPTED' },
          select: { trainerId: true },
        },
      },
    });

    return lessons.map((lesson) => ({
      id: lesson.id,
      userId: lesson.userId,
      nickname: lesson.user.nickname,
      lessonSubType: lesson.lessonSubType,
      trainerId: lesson.lessonQuotes.length > 0 ? lesson.lessonQuotes[0].trainerId : null,
    }));
  }
}
