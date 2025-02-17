import { QueryTrainerDto } from '#trainer/dto/trainer.dto.js';
import {
  CreateFavoriteTrainer,
  RemoveFavoriteTrainer,
  FavoriteTrainerResponse,
  TrainerWithFavorites,
} from '#trainer/type/trainer.type.js';

export interface ITrainerService {
  getTrainers(query: QueryTrainerDto): Promise<{ trainers: TrainerWithFavorites[]; totalCount: number }>;
  addFavoriteTrainer(data: CreateFavoriteTrainer): Promise<FavoriteTrainerResponse>;
  removeFavoriteTrainer(data: RemoveFavoriteTrainer): Promise<{ message: string }>;
  getFavoriteTrainers(
    query: QueryTrainerDto,
  ): Promise<{ trainers: TrainerWithFavorites[]; totalCount: number; hasMore: boolean }>;
}
