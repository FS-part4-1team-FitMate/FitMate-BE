import { Controller, Post, Delete, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { TrainerService } from '#trainer/trainer.service.js';
import type { CreateFavoriteTrainer, RemoveFavoriteTrainer } from '#trainer/type/trainer.type.js';

@Controller('trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

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
