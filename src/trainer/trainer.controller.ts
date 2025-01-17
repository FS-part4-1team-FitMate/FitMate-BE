import { Controller, Get, Post, Delete, Body, UseGuards, Query } from '@nestjs/common';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { TrainerService } from '#trainer/trainer.service.js';
import type { CreateFavoriteTrainer, RemoveFavoriteTrainer } from '#trainer/type/trainer.type.js';
import { QueryTrainerDto } from './dto/trainer.dto.js';

@Controller('trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async getTrainers(@Query() query: QueryTrainerDto) {
    return this.trainerService.getTrainers(query);
  }

  @Get('favorite')
  @UseGuards(AccessTokenGuard)
  async getFavoriteTrainers() {
    return this.trainerService.getFavoriteTrainers();
  }

  @Post('favorite')
  @UseGuards(AccessTokenGuard)
  async addFavoriteTrainer(@Body() data: CreateFavoriteTrainer) {
    return this.trainerService.addFavoriteTrainer(data);
  }

  @Delete('favorite')
  @UseGuards(AccessTokenGuard)
  async removeFavoriteTrainer(@Body() data: RemoveFavoriteTrainer) {
    return this.trainerService.removeFavoriteTrainer(data);
  }
}
