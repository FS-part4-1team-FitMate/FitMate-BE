import { Injectable } from '@nestjs/common';
import { PrismaService } from '#prisma/prisma.service.js';
import { ITrainerRepository } from '#trainer/interface/trainer.repository.interface.js';
import type {
  CreateFavoriteTrainer,
  RemoveFavoriteTrainer,
  FavoriteTrainerResponse,
  TrainerWithFavorites,
} from '#trainer/type/trainer.type';

@Injectable()
export class TrainerRepository implements ITrainerRepository {
  private readonly user;

  constructor(private readonly prisma: PrismaService) {
    this.user = prisma.user;
  }

  async findFavoriteByUserId(userId: string): Promise<TrainerWithFavorites[]> {
    const trainers = await this.user.findMany({
      where: { favoritedByUsers: { some: { userId } } },
      select: {
        id: true,
        nickname: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            profileImage: true,
            intro: true,
            lessonType: true,
            experience: true,
            rating: true,
            reviewCount: true,
            lessonCount: true,
          },
        },
        _count: {
          select: {
            favoritedByUsers: true,
          },
        },
      },
    });
    return trainers as TrainerWithFavorites[];
  }

  async findFavoriteTrainerIds(userId: string): Promise<string[]> {
    const favorites = await this.prisma.favoriteTrainer.findMany({
      where: { userId },
      select: {
        trainerId: true,
      },
    });

    return favorites.map((fav) => fav.trainerId);
  }

  async findAll(
    userId: string | null,
    where: Record<string, unknown>,
    orderBy: Record<string, 'asc' | 'desc'> | { profile: Record<string, 'asc' | 'desc'> },
    skip: number,
    take: number,
  ): Promise<TrainerWithFavorites[]> {
    return (await this.user.findMany({
      where: { role: 'TRAINER', ...where },
      select: {
        id: true,
        nickname: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            profileImage: true,
            intro: true,
            lessonType: true,
            experience: true,
            rating: true,
            reviewCount: true,
            lessonCount: true,
          },
        },
        _count: {
          select: {
            favoritedByUsers: true,
          },
        },
      },
      orderBy, // 서비스에서 보낸 `orderBy` 그대로 적용
      skip,
      take,
    })) as TrainerWithFavorites[];
  }

  // 트레이너 수 조회
  async count(where: Record<string, any> = {}): Promise<number> {
    return this.user.count({ where: { role: 'TRAINER', ...where } });
  }

  async findTrainersWithFavorites(userId?: string): Promise<TrainerWithFavorites[]> {
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

  async findFavoriteTrainerCount(trainerId: string): Promise<number> {
    return await this.prisma.favoriteTrainer.count({
      where: { trainerId },
    });
  }
}
