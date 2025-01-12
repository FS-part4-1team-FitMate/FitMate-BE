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
      select: { id: true, userId: true, trainerId: true, createdAt: true, updatedAt: true },
    });
  }

  async removeFavoriteTrainer(userId: string, data: RemoveFavoriteTrainer): Promise<void> {
    await this.prisma.favoriteTrainer.deleteMany({
      where: { userId, trainerId: data.trainerId },
    });
  }

  async findFavoriteTrainer(userId: string, trainerId: string): Promise<FavoriteTrainerResponse | null> {
    return await this.prisma.favoriteTrainer.findFirst({
      where: { userId, trainerId },
      select: { id: true, userId: true, trainerId: true, createdAt: true, updatedAt: true },
    });
  }
}
