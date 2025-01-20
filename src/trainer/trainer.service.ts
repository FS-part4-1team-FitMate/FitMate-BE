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

@Injectable()
export class TrainerService implements ITrainerService {
  constructor(
    private readonly trainerRepository: TrainerRepository,
    private readonly alsStore: AlsStore,
  ) {}

  async getFavoriteTrainers(): Promise<TrainerWithFavorites[]> {
    const { userId } = this.alsStore.getStore();
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }

    const favorites = await this.trainerRepository.findFavoriteByUserId(userId);

    // 기본 값 처리가 이미 되어 있으므로 단순히 `isFavorite`만 추가
    return favorites.map((trainer) => ({
      ...trainer,
      isFavorite: true, // 서비스 계층에서 추가적인 가공
    }));
  }

  // 강사 리스트 조회
  async getTrainers(
    query: QueryTrainerDto,
  ): Promise<{ trainers: TrainerWithFavorites[]; totalCount: number; hasMore: boolean }> {
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

    const orderMapping: Record<string, 'reviewCount' | 'rating' | 'experience' | 'lessonCount'> = {
      review_count: 'reviewCount',
      rating: 'rating',
      experience: 'experience',
      lesson_count: 'lessonCount',
    };

    const orderByField = orderMapping[order] || 'reviewCount';

    const validSortValues: ('asc' | 'desc')[] = ['asc', 'desc'];
    const sortValue: 'asc' | 'desc' = validSortValues.includes(sort as 'asc' | 'desc')
      ? (sort as 'asc' | 'desc')
      : 'desc';

    const orderBy: Record<string, 'asc' | 'desc'> = {
      [orderByField]: sortValue,
    };

    const where = {
      ...(keyword && { nickname: { contains: keyword, mode: 'insensitive' } }),
      profile: {
        ...(lessonType && { lessonType: { hasSome: lessonType } }),
        ...(gender && { gender }),
      },
    };

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
        experience: trainer.profile?.experience ?? 0,
        rating: trainer.profile?.rating ?? 0,
        reviewCount: trainer.profile?.reviewCount ?? 0,
        lessonCount: trainer.profile?.lessonCount ?? 0,
      },
      isFavorite: userId ? (trainer.favoritedByUsers ?? []).length > 0 : false,
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
