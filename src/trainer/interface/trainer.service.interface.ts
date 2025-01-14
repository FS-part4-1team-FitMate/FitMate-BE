import {
  CreateFavoriteTrainer,
  RemoveFavoriteTrainer,
  FavoriteTrainerResponse,
} from '../type/trainer.type.js';

export interface ITrainerService {
  addFavoriteTrainer(data: CreateFavoriteTrainer): Promise<FavoriteTrainerResponse>;
  removeFavoriteTrainer(data: RemoveFavoriteTrainer): Promise<void>;
}
