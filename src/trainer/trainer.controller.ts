import { Controller, Post, Delete, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { TrainerService } from '#trainer/trainer.service.js';
import type { CreateFavoriteTrainer, RemoveFavoriteTrainer } from '#trainer/type/trainer.type.js';

@Controller('trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Post('favorite')
  @UseGuards(AccessTokenGuard)
  async addFavoriteTrainer(@Req() req: any, @Body() data: CreateFavoriteTrainer) {
    const userId = req.user?.userId; // JwtStrategy에서 설정된 userId
    if (!userId) {
      throw new UnauthorizedException('인증 정보가 유효하지 않습니다.');
    }
    return this.trainerService.addFavoriteTrainer(userId, data);
  }

  @Delete('favorite')
  @UseGuards(AccessTokenGuard)
  async removeFavoriteTrainer(@Req() req: any, @Body() data: RemoveFavoriteTrainer) {
    const userId = req.user?.userId; // JwtStrategy에서 설정된 userId
    if (!userId) {
      throw new UnauthorizedException('인증 정보가 유효하지 않습니다.');
    }
    return this.trainerService.removeFavoriteTrainer(userId, data);
  }
}
