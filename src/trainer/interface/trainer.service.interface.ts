import {
  CreateFavoriteTrainer,
  RemoveFavoriteTrainer,
  FavoriteTrainerResponse,
} from '#trainer/type/trainer.type.js';

export interface ITrainerService {
  getTrainers(): Promise<{ trainers: any[]; totalCount: number }>;
  addFavoriteTrainer(data: CreateFavoriteTrainer): Promise<FavoriteTrainerResponse>;
  removeFavoriteTrainer(data: RemoveFavoriteTrainer): Promise<void>;
}
