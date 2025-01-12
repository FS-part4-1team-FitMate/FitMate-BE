import { CreateFavoriteTrainer, RemoveFavoriteTrainer, FavoriteTrainerResponse } from '../type/trainer.type.js';

export interface ITrainerRepository {
  addFavoriteTrainer(userId: string, data: CreateFavoriteTrainer): Promise<FavoriteTrainerResponse>;
  removeFavoriteTrainer(userId: string, data: RemoveFavoriteTrainer): Promise<void>;
  findFavoriteTrainer(userId: string, trainerId: string): Promise<FavoriteTrainerResponse | null>;
}
