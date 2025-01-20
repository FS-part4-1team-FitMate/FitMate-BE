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
        favoritedByUsers: false,
      },
    });

    // 기본 값 추가
    return trainers.map<TrainerWithFavorites>((trainer) => ({
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
    }));
  }

  async findAll(
    userId: string | null,
    where: Record<string, unknown> = {},
    orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' },
    skip = 0,
    take = 10,
  ): Promise<TrainerWithFavorites[]> {
    const profileOrderByFields = ['reviewCount', 'rating', 'lessonCount'];
    const orderByClause = profileOrderByFields.includes(Object.keys(orderBy)[0])
      ? { profile: orderBy }
      : orderBy;

    const trainers = await this.user.findMany({
      where: { role: 'TRAINER', ...where },
      include: {
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
        favoritedByUsers: userId ? { where: { userId } } : false,
      },
      orderBy: orderByClause,
      skip,
      take,
    });

    return trainers.map((trainer) => ({
      id: trainer.id,
      nickname: trainer.nickname,
      email: trainer.email,
      createdAt: trainer.createdAt,
      updatedAt: trainer.updatedAt,
      profile: trainer.profile
        ? {
            profileImage: trainer.profile.profileImage ?? null,
            intro: trainer.profile.intro ?? '',
            lessonType: trainer.profile.lessonType ?? [],
            experience: trainer.profile.experience ?? 0,
            rating: trainer.profile.rating ?? 0,
            reviewCount: trainer.profile.reviewCount ?? 0,
            lessonCount: trainer.profile.lessonCount ?? 0,
          }
        : null,
      favoritedByUsers: trainer.favoritedByUsers ?? [],
    }));
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
}
