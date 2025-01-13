import { Controller, Post, Delete, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AlsStore } from '#common/als/store-validator.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { TrainerService } from '#trainer/trainer.service.js';
import type { CreateFavoriteTrainer, RemoveFavoriteTrainer } from '#trainer/type/trainer.type.js';

@Controller('trainers')
export class TrainerController {
  constructor(
    private readonly trainerService: TrainerService,
    private readonly alsStore: AlsStore,
  ) {}

  @Post('favorite')
  @UseGuards(AccessTokenGuard)
  async addFavoriteTrainer(@Body() data: CreateFavoriteTrainer) {
    const { userId } = this.alsStore.getStore();
    return this.trainerService.addFavoriteTrainer(userId, data);
  }

  @Delete('favorite')
  @UseGuards(AccessTokenGuard)
  async removeFavoriteTrainer(@Body() data: RemoveFavoriteTrainer) {
    const { userId } = this.alsStore.getStore();
    return this.trainerService.removeFavoriteTrainer(userId, data);
  }
}
