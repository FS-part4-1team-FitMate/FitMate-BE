import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AlsStore } from '#common/als/store-validator.js';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import TrainerExceptionMessage from '#exception/trainer-exception-message.js';
import { QueryTrainerDto } from '#trainer/dto/trainer.dto.js';
import { ITrainerService } from '#trainer/interface/trainer.service.interface.js';
import { TrainerRepository } from '#trainer/trainer.repository.js';
import type {
  CreateFavoriteTrainer,
  RemoveFavoriteTrainer,
  FavoriteTrainerResponse,
  TrainerWithFavorites,
} from '#trainer/type/trainer.type.js';
import { S3Service } from '#s3/s3.service.js';

@Injectable()
export class TrainerService implements ITrainerService {
  constructor(
    private readonly trainerRepository: TrainerRepository,
    private readonly alsStore: AlsStore,
    private readonly s3Service: S3Service,
  ) {}

  async getFavoriteTrainers(
    query: QueryTrainerDto,
  ): Promise<{ trainers: TrainerWithFavorites[]; totalCount: number; hasMore: boolean }> {
    const { userId } = this.alsStore.getStore();
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    // 찜한 트레이너 ID 가져오기
    const favoriteTrainerIds = await this.trainerRepository.findFavoriteTrainerIds(userId);

    if (favoriteTrainerIds.length === 0) {
      return { trainers: [], totalCount: 0, hasMore: false };
    }

    // 찜한 트레이너 목록 가져오기
    const trainers = await this.trainerRepository.findAll(
      userId,
      { id: { in: favoriteTrainerIds } },
      { createdAt: 'desc' },
      skip,
      limit,
    );

    // 찜한 트레이너 총 개수 가져오기
    const totalCount = await this.trainerRepository.countFavoriteByUserId(userId);

    // 프로필 이미지 presigned URL 생성
    const trainersWithPresignedUrls = await Promise.all(
      trainers.map(async (trainer) => {
        const { profileImage, ...profileWithoutImage } = trainer.profile || {};
        return {
          ...trainer,
          profile: {
            ...profileWithoutImage,
            profileImagePresignedUrl: profileImage
              ? await this.s3Service.getPresignedDownloadUrl(profileImage)
              : undefined,
            lessonType: trainer.profile?.lessonType ?? [],
          },
        };
      }),
    );

    return { trainers: trainersWithPresignedUrls, totalCount, hasMore: totalCount > page * limit };
  }

  async getFavoriteStatus(trainerId: string): Promise<{ isFavorite: boolean; favoriteTotalCount: number }> {
    const store = this.alsStore.getStore();
    const userId = store?.userId || null;

    const favoriteTotalCount = await this.trainerRepository.findFavoriteTrainerCount(trainerId);
    let isFavorite = false;

    if (userId) {
      const favoriteTrainer = await this.trainerRepository.findFavoriteTrainer(userId, trainerId);
      isFavorite = !!favoriteTrainer;
    }

    return {
      isFavorite,
      favoriteTotalCount,
    };
  }

  // 강사 리스트 조회
  async getTrainers(
    query: QueryTrainerDto,
  ): Promise<{ trainers: TrainerWithFavorites[]; totalCount: number; hasMore: boolean }> {
    const store = this.alsStore.getStore();
    const userId = store?.userId || null;

    const orderByField = query.order ?? 'reviewCount';

    const sortValue: 'asc' | 'desc' = query.sort === 'asc' || query.sort === 'desc' ? query.sort : 'desc';

    const profileOrderByFields = ['reviewCount', 'rating', 'lessonCount', 'experience'];
    const orderBy = profileOrderByFields.includes(orderByField)
      ? { profile: { [orderByField]: sortValue } }
      : { [orderByField]: sortValue };

    const where = {
      role: 'TRAINER',
      OR: query.keyword
        ? [
            { nickname: { contains: query.keyword, mode: 'insensitive' } },
            { profile: { name: { contains: query.keyword, mode: 'insensitive' } } },
          ]
        : undefined,
      profile: {
        ...(query.lessonType && { lessonType: { hasSome: query.lessonType } }),
        ...(query.gender && { gender: query.gender }),
      },
    };

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const take = limit;

    const [trainers, totalCount] = await Promise.all([
      this.trainerRepository.findAll(userId, where, orderBy, skip, take),
      this.trainerRepository.count(where),
    ]);

    let favoriteTrainerIds: string[] = [];
    if (userId) {
      favoriteTrainerIds = await this.trainerRepository.findFavoriteTrainerIds(userId);
    }

    const trainersWithFavoriteStatus = trainers.map((trainer) => ({
      ...trainer,
      isFavorite: favoriteTrainerIds.includes(trainer.id),
    }));

    return { trainers: trainersWithFavoriteStatus, totalCount, hasMore: totalCount > page * limit };
  }

  // 찜 등록
  async addFavoriteTrainer(data: CreateFavoriteTrainer): Promise<FavoriteTrainerResponse> {
    const { userId } = this.alsStore.getStore();
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }

    const existingFavorite = await this.trainerRepository.findFavoriteTrainer(userId, data.trainerId);
    if (existingFavorite) {
      throw new BadRequestException(TrainerExceptionMessage.ALREADY_FAVORITED);
    }

    return this.trainerRepository.addFavoriteTrainer(userId, data);
  }

  // 찜 삭제
  async removeFavoriteTrainer(data: RemoveFavoriteTrainer): Promise<{ message: string }> {
    const { userId } = this.alsStore.getStore();
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }

    const existingFavorite = await this.trainerRepository.findFavoriteTrainer(userId, data.trainerId);
    if (!existingFavorite) {
      throw new NotFoundException(TrainerExceptionMessage.NOT_FAVORITED);
    }

    await this.trainerRepository.removeFavoriteTrainer(userId, data);

    return { message: TrainerExceptionMessage.SUCCESS_DELETE };
  }
}
