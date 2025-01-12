import { Injectable, BadRequestException } from '@nestjs/common';
import { TrainerRepository } from '#trainer/trainer.repository.js';
import type { CreateFavoriteTrainer, RemoveFavoriteTrainer, FavoriteTrainerResponse } from '#trainer/type/trainer.type.js';

@Injectable()
export class TrainerService {
  constructor(private readonly trainerRepository: TrainerRepository) {}

  async addFavoriteTrainer(userId: string, data: CreateFavoriteTrainer): Promise<FavoriteTrainerResponse> {
    // 이미 찜한 강사인지 확인
    const existingFavorite = await this.trainerRepository.findFavoriteTrainer(userId, data.trainerId);
    if (existingFavorite) {
      throw new BadRequestException('이미 찜한 강사입니다.');
    }

    // 찜 추가
    return await this.trainerRepository.addFavoriteTrainer(userId, data);
  }

  async removeFavoriteTrainer(userId: string, data: RemoveFavoriteTrainer): Promise<void> {
    // 찜 제거
    await this.trainerRepository.removeFavoriteTrainer(userId, data);
  }
}
