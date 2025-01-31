import { Injectable } from '@nestjs/common';
import type { DirectQuoteRequest, LessonRequest } from '@prisma/client';
import { DirectQuoteRequestStatus, LessonRequestStatus, Prisma, Region } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
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
}
