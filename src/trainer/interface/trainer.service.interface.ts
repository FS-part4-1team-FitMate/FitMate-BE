import {
  CreateFavoriteTrainer,
  RemoveFavoriteTrainer,
  FavoriteTrainerResponse,
  TrainerWithFavorites,
} from '#trainer/type/trainer.type.js';

export interface ITrainerService {
  getTrainers(): Promise<{ trainers: TrainerWithFavorites[]; totalCount: number }>;
  addFavoriteTrainer(data: CreateFavoriteTrainer): Promise<FavoriteTrainerResponse>;
  removeFavoriteTrainer(data: RemoveFavoriteTrainer): Promise<void>;
}
