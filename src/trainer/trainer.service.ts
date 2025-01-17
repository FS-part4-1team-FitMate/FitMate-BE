import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AlsStore } from '#common/als/store-validator.js';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import TrainerExceptionMessage from '#exception/trainer-exception-message.js';
import { QueryTrainerDto } from '#trainer/dto/trainer.dto.js';
import { TrainerRepository } from '#trainer/trainer.repository.js';
import type {
  CreateFavoriteTrainer,
  RemoveFavoriteTrainer,
  FavoriteTrainerResponse,
} from '#trainer/type/trainer.type.js';

@Injectable()
export class TrainerService {
  constructor(
    private readonly trainerRepository: TrainerRepository,
    private readonly alsStore: AlsStore,
  ) {}

  async getFavoriteTrainers(): Promise<any[]> {
    const { userId } = this.alsStore.getStore();
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }

    const favorites = await this.trainerRepository.findFavoriteByUserId(userId);

    return favorites.map((trainer) => ({
      id: trainer.id,
      nickname: trainer.nickname,
      email: trainer.email,
      createdAt: trainer.createdAt,
      updatedAt: trainer.updatedAt,
      profile: {
        profileImage: trainer.profile?.profileImage || null,
        intro: trainer.profile?.intro || '',
        lessonType: trainer.profile?.lessonType || [],
        experience: trainer.profile?.experience || 0,
        rating: trainer.profile?.rating || 0,
        reviewCount: trainer.profile?.reviewCount || 0,
        lessonCount: trainer.profile?.lessonCount || 0,
      },
      isFavorite: true,
    }));
  }

  // 강사 리스트 조회
  async getTrainers(
    query: QueryTrainerDto,
  ): Promise<{ trainers: any[]; totalCount: number; hasMore: boolean }> {
    const store = this.alsStore.getStore();
    const userId = store?.userId || null;

    const {
      page = 1,
      limit = 5,
      order = 'review_count',
      sort = 'desc',
      keyword,
      lessonType,
      gender,
    } = query.toCamelCase();

    const orderMapping: Record<string, string> = {
      review_count: 'reviewCount',
      rating: 'rating',
      experience: 'experience',
      lesson_count: 'lessonCount',
    };

    const orderByField = orderMapping[order] || 'reviewCount';

    const where = {
      ...(keyword && { nickname: { contains: keyword, mode: 'insensitive' } }),
      profile: {
        ...(lessonType && { lessonType: { hasSome: lessonType } }),
        ...(gender && { gender }),
      },
    };

    const orderBy: Record<string, string> = {};
    orderBy[orderByField] = sort;

    const skip = (page - 1) * limit;
    const take = limit;

    const [trainers, totalCount] = await Promise.all([
      this.trainerRepository.findAll(userId, where, orderBy, skip, take),
      this.trainerRepository.count(where),
    ]);

    const trainersWithDetails = trainers.map((trainer) => ({
      id: trainer.id,
      nickname: trainer.nickname,
      email: trainer.email,
      profile: {
        profileImage: trainer.profile?.profileImage || null,
        intro: trainer.profile?.intro || '',
        lessonType: trainer.profile?.lessonType || [],
        experience: trainer.profile?.experience || 0,
        rating: trainer.profile?.rating || 0,
        reviewCount: trainer.profile?.reviewCount || 0,
        lessonCount: trainer.profile?.lessonCount || 0,
      },
      isFavorite: userId ? trainer.favoritedByUsers.length > 0 : false,
    }));

    return { trainers: trainersWithDetails, totalCount, hasMore: totalCount > page * limit };
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
  async removeFavoriteTrainer(data: RemoveFavoriteTrainer): Promise<void> {
    const { userId } = this.alsStore.getStore();
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }

    const existingFavorite = await this.trainerRepository.findFavoriteTrainer(userId, data.trainerId);
    if (!existingFavorite) {
      throw new NotFoundException(TrainerExceptionMessage.NOT_FAVORITED);
    }

    await this.trainerRepository.removeFavoriteTrainer(userId, data);
  }
}
