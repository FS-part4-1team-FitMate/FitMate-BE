import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DirectQuoteRequest, LessonRequestStatus, Prisma, Region } from '@prisma/client';
import { AlsStore } from '#common/als/store-validator.js';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import LessonExceptionMessage from '#exception/lesson-exception-message.js';
import { UserRepository } from '#user/user.repository.js';
import type { IQuoteService } from '#quote/interface/quote-service.inteface.js';
import { CreateDirectQuoteDto, QueryLessonDto, RejectDirectQuoteDto } from './dto/lesson.dto.js';
import { ILessonService } from './interface/lesson-service.interface.js';
import { LessonRepository } from './lesson.repository.js';
import { CreateLesson, LessonResponse, PatchLesson } from './type/lesson.type.js';

@Injectable()
export class LessonService implements ILessonService {
  constructor(
    private readonly lessonRepository: LessonRepository,
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => 'IQuoteService'))
    private readonly quoteService: IQuoteService,
    private readonly alsStore: AlsStore,
  ) {}

  private getUserId(): string {
    const { userId } = this.alsStore.getStore();
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }
    return userId;
  }
  /*************************************************************************************
   * 요청 레슨 생성
   * ***********************************************************************************
   */
  async createLesson(data: CreateLesson): Promise<LessonResponse> {
    const userId = this.getUserId();
    const { userRole } = this.alsStore.getStore();

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
   * 나의 요청 레슨 목록 조회
   * ***********************************************************************************
   */
  async getMyLessons(query: QueryLessonDto): Promise<{
    list: LessonResponse[];
    totalCount: number;
    hasMore: boolean;
  }> {
    const userId = this.getUserId();
    return this.getLessons(query, userId);
  }

  /*************************************************************************************
   * 요청 레슨 목록 조회
   * ***********************************************************************************
   */
  async getLessons(
    query: QueryLessonDto,
    myLessonUserId?: string,
  ): Promise<{
    list: LessonResponse[];
    totalCount: number;
    hasMore: boolean;
    lessonTypeCounts: Record<string, number>;
    genderCounts: Record<string, number>;
    directQuoteRequestCount: number;
  }> {
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

    const regionMapping: Record<Region, string[]> = {
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

    const currentUserId = this.getUserId();

    // 필터 조건 구성
    const where = {
      ...(myLessonUserId && { userId: myLessonUserId }),
      ...(lessonType && { lessonType: { in: lessonType } }),
      ...(lessonSubType && { lessonSubType: { in: lessonSubType } }),
      ...(locationType && { locationType: { in: locationType } }),
      ...(status && { status: { in: status } }),
      ...(gender && {
        user: {
          profile: {
            gender: { in: gender },
          },
        },
      }),
      ...(hasDirectQuote !== undefined && {
        directQuoteRequests: hasDirectQuote
          ? { some: { trainerId: currentUserId } }
          : { none: { trainerId: currentUserId } },
      }),
      AND: [
        ...(region
          ? [
              {
                OR: region.flatMap(
                  (r) =>
                    regionMapping[r]?.map((koreanRegion) => ({
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
                  { user: { nickname: { contains: keyword, mode: 'insensitive' } } },
                  { user: { profile: { name: { contains: keyword, mode: 'insensitive' } } } },
                ],
              },
            ]
          : []),
      ],
    };

    const orderBy: Record<string, string> = {};
    orderBy[orderByField] = sort;
    const skip = (page - 1) * limit;
    const take = limit;

    const select: Prisma.LessonRequestSelect = {
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
          id: true,
          lessonRequestId: true,
          trainerId: true,
          status: true,
          rejectionReason: true,
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
    };

    const [lessons, totalCount] = await Promise.all([
      this.lessonRepository.findAll(where, orderBy, skip, take, select),
      this.lessonRepository.count(where),
    ]);

    // 전체 레슨 타입 목록 정의 (초기값)
    const allLessonTypes = ['SPORTS', 'FITNESS', 'REHAB'];
    const lessonTypeCounts = allLessonTypes.reduce<Record<string, number>>((acc, type) => {
      acc[type] = 0;
      return acc;
    }, {});

    // lessonType별 통계 업데이트
    const groupResult = await this.lessonRepository.groupByLessonTypeAll();
    groupResult.forEach((result) => {
      lessonTypeCounts[result.lessonType] = result.count;
    });

    // 전체 요청 레슨에 대한 남/여 수 (초기값)
    const genderCounts = { male: 0, female: 0 };

    // 남/여 카운트 계산
    const allLessons = await this.lessonRepository.findAllForGenderCount();
    allLessons.forEach((lr) => {
      if (lr.user?.profile?.gender === 'MALE') {
        genderCounts.male++;
      } else if (lr.user?.profile?.gender === 'FEMALE') {
        genderCounts.female++;
      }
    });

    // 지정 견적 요청 수 계산
    const directQuoteRequestCount = allLessons.reduce((count, lesson) => {
      const hasDirectQuote = lesson.directQuoteRequests?.some((req) => req.trainerId === currentUserId);
      return hasDirectQuote ? count + 1 : count;
    }, 0);

    const lessonsWithDirectQuote = lessons.map((lesson) => ({
      ...lesson,
      isDirectQuote: currentUserId
        ? (lesson.directQuoteRequests?.some((req) => req.trainerId === currentUserId) ?? false)
        : false,
    }));

    return {
      list: lessonsWithDirectQuote,
      totalCount,
      hasMore: totalCount > page * limit,
      lessonTypeCounts,
      genderCounts,
      directQuoteRequestCount,
    };
  }

  /*************************************************************************************
   * 요청 레슨 상세조회
   * ***********************************************************************************
   */
  async getLessonById(id: string): Promise<LessonResponse> {
    const select = {
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
    };

    const lesson = await this.lessonRepository.findOne(id, select);
    if (!lesson) {
      throw new NotFoundException(LessonExceptionMessage.LESSON_NOT_FOUND);
    }

    const currentUserId = this.getUserId();
    const isDirectQuote = currentUserId
      ? (lesson.directQuoteRequests?.some((req) => req.trainerId === currentUserId) ?? false)
      : false;

    return { ...lesson, isDirectQuote };
  }

  /*************************************************************************************
   * 요청 레슨 취소
   * ***********************************************************************************
   */
  async cancelLessonById(lessonId: string): Promise<LessonResponse> {
    const userId = this.getUserId();

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

  /*************************************************************************************
   * 내가 생성한 요청 레슨에 대해 지정 견적 요청 생성
   * ***********************************************************************************
   */
  async createDirectQuoteRequest(
    lessonId: string,
    { trainerId }: CreateDirectQuoteDto,
  ): Promise<DirectQuoteRequest> {
    const userId = this.getUserId();

    // 요청 레슨 확인
    const lesson = await this.lessonRepository.findOne(lessonId);
    if (!lesson) {
      throw new NotFoundException(LessonExceptionMessage.LESSON_NOT_FOUND);
    }

    if (lesson.userId !== userId) {
      throw new UnauthorizedException(LessonExceptionMessage.NOT_MY_LESSON_DIRECT_QUOTE);
    }

    if (lesson.status !== LessonRequestStatus.PENDING) {
      throw new BadRequestException(LessonExceptionMessage.INVALID_LESSON_STATUS_FOR_QUOTE);
    }

    // 트레이너 확인
    const trainer = await this.userRepository.findUserById(trainerId);
    if (!trainer || trainer.role !== 'TRAINER') {
      throw new BadRequestException(LessonExceptionMessage.TRAINER_NOT_FOUND_OR_INVALID);
    }

    // 트레이너가 해당 요청 레슨에 이미 견적을 제출했는지 확인
    const hasSubmitted = await this.quoteService.hasTrainerSubmittedQuote(lessonId, trainerId);
    console.log('lesson service: hasSubmitted', hasSubmitted);
    if (hasSubmitted) {
      throw new BadRequestException(LessonExceptionMessage.TRAINER_ALREADY_SENT_QUOTE);
    }

    // 지정 견적 요청 개수 확인
    const existingDirectQuotes = await this.lessonRepository.findDirectQuoteRequestByLessonId(lessonId);
    if (existingDirectQuotes.length >= 3) {
      throw new BadRequestException(LessonExceptionMessage.DIRECT_QUOTE_LIMIT_REACHED);
    }

    // 중복 요청 확인
    const existingRequest = await this.lessonRepository.findDirectQuoteRequest(lessonId, trainerId);
    if (existingRequest) {
      throw new BadRequestException(LessonExceptionMessage.DIRECT_QUOTE_ALREADY_EXISTS);
    }

    return await this.lessonRepository.createDirectQuoteRequest({
      lessonRequestId: lessonId,
      trainerId,
    });
  }

  /*************************************************************************************
   * 지정 견적 요청에 대한 반려
   * ***********************************************************************************
   */
  async rejectDirectQuoteRequest(
    lessonId: string,
    directQuoteRequestId: string,
    rejectDirectQuoteDto: RejectDirectQuoteDto,
  ): Promise<DirectQuoteRequest> {
    const { rejectionReason } = rejectDirectQuoteDto;
    const trainerId = this.getUserId();

    const directQuoteRequest = await this.lessonRepository.findDirectQuoteRequestById(directQuoteRequestId);

    if (!directQuoteRequest) {
      throw new NotFoundException(LessonExceptionMessage.DIRECT_QUOTE_NOT_FOUND);
    }

    if (directQuoteRequest.trainerId != trainerId) {
      throw new UnauthorizedException(LessonExceptionMessage.NOT_MY_DIRECT_QUOTE_REQUEST);
    }

    if (directQuoteRequest.lessonRequestId != lessonId) {
      throw new BadRequestException(LessonExceptionMessage.INVALID_LESSON_REQUEST_MATCH);
    }

    if (directQuoteRequest.status != 'PENDING') {
      throw new BadRequestException(LessonExceptionMessage.INVALID_DIRECT_QUOTE_STATUS);
    }

    return await this.lessonRepository.updateDirectQuoteRequest(directQuoteRequestId, {
      status: 'REJECTED',
      rejectionReason,
    });
  }

  /*************************************************************************************
   * 요청 레슨 수정
   * ***********************************************************************************
   */
  async updateLessonById(id: string, data: PatchLesson): Promise<LessonResponse> {
    const lesson = await this.lessonRepository.findOne(id);
    if (!lesson) {
      throw new NotFoundException(LessonExceptionMessage.LESSON_NOT_FOUND);
    }
    return await this.lessonRepository.update(id, data);
  }

  /*************************************************************************************
   * 요청 레슨 상태 업데이트
   * ***********************************************************************************
   */
  async updateLessonStatus(id: string, status: LessonRequestStatus): Promise<LessonResponse> {
    const lesson = await this.lessonRepository.findOne(id);
    if (!lesson) {
      throw new NotFoundException(LessonExceptionMessage.LESSON_NOT_FOUND);
    }
    return await this.lessonRepository.updateStatus(id, status);
  }
}
