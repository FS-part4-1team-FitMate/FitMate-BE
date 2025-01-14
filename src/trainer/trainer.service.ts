import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { AlsStore } from '#common/als/store-validator.js';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import TrainerExceptionMessage from '#exception/trainer-exception-message.js';
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

  async addFavoriteTrainer(data: CreateFavoriteTrainer): Promise<FavoriteTrainerResponse> {
    const { userId } = await this.alsStore.getStore();
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }

    // 이미 찜한 강사인지 확인
    const existingFavorite = await this.trainerRepository.findFavoriteTrainer(userId, data.trainerId);
    if (existingFavorite) {
      throw new BadRequestException(TrainerExceptionMessage.ALREADY_FAVORITED);
    }

    // 찜 추가
    return await this.trainerRepository.addFavoriteTrainer(userId, data);
  }

  async removeFavoriteTrainer(data: RemoveFavoriteTrainer): Promise<void> {
    const { userId } = this.alsStore.getStore();
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }

    // 이미 삭제된 강사인지 확인
    const existingFavorite = await this.trainerRepository.findFavoriteTrainer(userId, data.trainerId);
    if (!existingFavorite) {
      throw new NotFoundException(TrainerExceptionMessage.NOT_FAVORITED);
    }

    // 찜 제거
    await this.trainerRepository.removeFavoriteTrainer(userId, data);
  }
}
