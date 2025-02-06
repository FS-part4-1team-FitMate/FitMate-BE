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

    return favorites.map((trainer) => ({
      ...trainer,
      isFavorite: true,
    }));
  }

  async getFavoriteStatus(trainerId: string): Promise<{ isFavorite: boolean; favoriteTotalCount: number }> {
    const { userId } = this.alsStore.getStore();
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }

    const favoriteTrainer = await this.trainerRepository.findFavoriteTrainer(userId, trainerId);
    const favoriteTotalCount = await this.trainerRepository.findFavoriteTrainerCount(trainerId);

    return {
      isFavorite: !!favoriteTrainer,
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
      ...(query.keyword && { nickname: { contains: query.keyword, mode: 'insensitive' } }),
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
