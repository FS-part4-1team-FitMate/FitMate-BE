import { CreateFavoriteTrainer, RemoveFavoriteTrainer, FavoriteTrainerResponse } from '../type/trainer.type.js';

export interface ITrainerService {
  addFavoriteTrainer(userId: string, data: CreateFavoriteTrainer): Promise<FavoriteTrainerResponse>;
  removeFavoriteTrainer(userId: string, data: RemoveFavoriteTrainer): Promise<void>;
}
