import { Controller, Get, Post, Delete, Body, UseGuards, Query, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { TrainerService } from '#trainer/trainer.service.js';
import type {
  CreateFavoriteTrainer,
  RemoveFavoriteTrainer,
  TrainerWithFavorites,
} from '#trainer/type/trainer.type.js';
import {
  FavoriteTrainerResponseDto,
  FavoriteTrainerStatusResponseDto,
  QueryTrainerDto,
  TrainerListResponseDto,
  TrainerWithFavoritesResponseDto,
} from './dto/trainer.dto.js';

@ApiTags('trainers')
@ApiBearerAuth()
@Controller('trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: '트레이너 목록 조회',
    description: '필터링 옵션을 적용하여 트레이너 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '트레이너 목록 조회 성공',
    type: [TrainerListResponseDto],
  })
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
  @ApiOperation({
    summary: '찜한 트레이너 목록 조회',
    description: '사용자가 찜한 트레이너 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '찜한 트레이너 목록 조회 성공',
    type: [TrainerWithFavoritesResponseDto],
  })
  async getFavoriteTrainers(
    @Query() query: QueryTrainerDto,
  ): Promise<{ trainers: TrainerWithFavorites[]; totalCount: number; hasMore: boolean }> {
    return this.trainerService.getFavoriteTrainers(query);
  }

  @Get(':trainerId/favorite')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: '트레이너 찜 상태 조회',
    description: '특정 트레이너의 찜 여부와 총 찜 개수를 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '찜 상태 조회 성공', type: FavoriteTrainerStatusResponseDto })
  async getFavoriteStatus(
    @Param('trainerId') trainerId: string,
  ): Promise<{ isFavorite: boolean; favoriteTotalCount: number }> {
    return this.trainerService.getFavoriteStatus(trainerId);
  }

  @Post(':trainerId/favorite')
  @ApiOperation({
    summary: '트레이너 찜 등록',
    description: '사용자가 특정 트레이너를 찜 목록에 추가합니다.',
  })
  @ApiResponse({ status: 201, description: '트레이너 찜 등록 성공', type: FavoriteTrainerResponseDto })
  @UseGuards(AccessTokenGuard)
  async addFavoriteTrainer(@Param('trainerId') trainerId: string) {
    return this.trainerService.addFavoriteTrainer({ trainerId });
  }

  @Delete(':trainerId/favorite')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: '트레이너 찜 삭제',
    description: '사용자가 특정 트레이너를 찜 목록에서 제거합니다.',
  })
  @ApiResponse({ status: 200, description: '트레이너 찜 삭제 성공' })
  async removeFavoriteTrainer(@Param('trainerId') trainerId: string) {
    return this.trainerService.removeFavoriteTrainer({ trainerId });
  }
}
