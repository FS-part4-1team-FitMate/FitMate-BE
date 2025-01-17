import { Injectable } from '@nestjs/common';
import { PrismaService } from '#prisma/prisma.service.js';
import { ITrainerRepository } from '#trainer/interface/trainer.repository.interface.js';
import type {
  CreateFavoriteTrainer,
  RemoveFavoriteTrainer,
  FavoriteTrainerResponse,
} from '#trainer/type/trainer.type';

@Injectable()
export class TrainerRepository implements ITrainerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findFavoriteByUserId(userId: string): Promise<any[]> {
    return this.prisma.user.findMany({
      where: {
        favoritedByUsers: {
          some: {
            userId,
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async findAll(
    userId: string | null,
    where: Record<string, any> = {},
    orderBy: Record<string, any> = { createdAt: 'desc' },
    skip = 0,
    take = 10,
  ): Promise<any[]> {
    const profileOrderByFields = ['reviewCount', 'rating', 'lessonCount'];
    const orderByClause = profileOrderByFields.includes(Object.keys(orderBy)[0])
      ? { profile: orderBy }
      : orderBy;

    return this.prisma.user.findMany({
      where: { role: 'TRAINER', ...where },
      include: {
        profile: true,
        favoritedByUsers: userId ? { where: { userId } } : false,
      },
      orderBy: orderByClause,
      skip,
      take,
    });
  }

  // 트레이너 수 조회
  async count(where: Record<string, any>): Promise<number> {
    return this.prisma.user.count({ where: { role: 'TRAINER', ...where } });
  }

  async countTrainers(): Promise<number> {
    return this.count({});
  }

  async findTrainersWithFavorites(userId?: string): Promise<any[]> {
    return this.findAll(userId || null, {}, { createdAt: 'desc' }, 0, 10);
  }

  // 찜 등록
  async addFavoriteTrainer(userId: string, data: CreateFavoriteTrainer): Promise<FavoriteTrainerResponse> {
    return await this.prisma.favoriteTrainer.create({
      data: { userId, trainerId: data.trainerId },
    });
  }

  // 찜 삭제
  async removeFavoriteTrainer(userId: string, data: RemoveFavoriteTrainer): Promise<void> {
    await this.prisma.favoriteTrainer.delete({
      where: {
        userId_trainerId: { userId, trainerId: data.trainerId },
      },
    });
  }

  // 찜 조회
  async findFavoriteTrainer(userId: string, trainerId: string): Promise<FavoriteTrainerResponse | null> {
    return await this.prisma.favoriteTrainer.findUnique({
      where: {
        userId_trainerId: { userId, trainerId },
      },
    });
  }
}
