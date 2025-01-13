import { Injectable } from '@nestjs/common';
import { PrismaService } from '#prisma/prisma.service.js';
import { ITrainerRepository } from '#trainer/interface/trainer.repository.interface.js';
import { CreateFavoriteTrainer, RemoveFavoriteTrainer, FavoriteTrainerResponse } from '#trainer/type/trainer.type.js';

@Injectable()
export class TrainerRepository implements ITrainerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addFavoriteTrainer(userId: string, data: CreateFavoriteTrainer): Promise<FavoriteTrainerResponse> {
    return await this.prisma.favoriteTrainer.create({
      data: { userId, trainerId: data.trainerId },
    });
  }

  async removeFavoriteTrainer(userId: string, data: RemoveFavoriteTrainer): Promise<void> {
    await this.prisma.favoriteTrainer.delete({
      where: {
        userId_trainerId: { userId, trainerId: data.trainerId },
      },
    });
  }

  async findFavoriteTrainer(userId: string, trainerId: string): Promise<FavoriteTrainerResponse | null> {
    return await this.prisma.favoriteTrainer.findUnique({
      where: { userId_trainerId: { userId, trainerId } },
    });
  }
}
