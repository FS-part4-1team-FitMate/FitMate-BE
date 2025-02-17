import { Controller, Get, Post, Delete, Body, UseGuards, Query, Param } from '@nestjs/common';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { TrainerService } from '#trainer/trainer.service.js';
import type {
  CreateFavoriteTrainer,
  RemoveFavoriteTrainer,
  TrainerWithFavorites,
} from '#trainer/type/trainer.type.js';
import { QueryTrainerDto } from './dto/trainer.dto.js';

@Controller('trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async getTrainers(
    @Query() query: QueryTrainerDto,
  ): Promise<{ trainers: TrainerWithFavorites[]; totalCount: number; hasMore: boolean }> {
    const snakeToCamel = {
      review_count: 'reviewCount',
      lesson_count: 'lessonCount',
    };

    const transformedQuery = {
      page: query.page || 1,
      limit: query.limit || 10,
      keyword: query.keyword,
      lessonType: query.lessonType,
      gender: query.gender,
      order: query.order || 'reviewCount',
      sort: query.sort || 'desc',
    };

    return this.trainerService.getTrainers(transformedQuery);
  }

  @Get('favorite')
  @UseGuards(AccessTokenGuard)
  async getFavoriteTrainers(
    @Query() query: QueryTrainerDto,
  ): Promise<{ trainers: TrainerWithFavorites[]; totalCount: number; hasMore: boolean }> {
    return this.trainerService.getFavoriteTrainers(query);
  }

  @Get(':trainerId/favorite')
  @UseGuards(AccessTokenGuard)
  async getFavoriteStatus(
    @Param('trainerId') trainerId: string,
  ): Promise<{ isFavorite: boolean; favoriteTotalCount: number }> {
    return this.trainerService.getFavoriteStatus(trainerId);
  }

  @Post(':trainerId/favorite')
  @UseGuards(AccessTokenGuard)
  async addFavoriteTrainer(@Param('trainerId') trainerId: string) {
    return this.trainerService.addFavoriteTrainer({ trainerId });
  }

  @Delete(':trainerId/favorite')
  @UseGuards(AccessTokenGuard)
  async removeFavoriteTrainer(@Param('trainerId') trainerId: string) {
    return this.trainerService.removeFavoriteTrainer({ trainerId });
  }
}
