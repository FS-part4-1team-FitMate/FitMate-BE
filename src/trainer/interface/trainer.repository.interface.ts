import {
  CreateFavoriteTrainer,
  RemoveFavoriteTrainer,
  FavoriteTrainerResponse,
  TrainerWithFavorites,
} from '#trainer/type/trainer.type.js';

export interface ITrainerRepository {
  findAll(
    userId: string | null,
    where: Record<string, any>,
    orderBy: Record<string, 'asc' | 'desc'>,
    skip: number,
    take: number,
  ): Promise<TrainerWithFavorites[]>;
  count(where: Record<string, any>): Promise<number>;
  addFavoriteTrainer(userId: string, data: CreateFavoriteTrainer): Promise<FavoriteTrainerResponse>;
  removeFavoriteTrainer(userId: string, data: RemoveFavoriteTrainer): Promise<void>;
  findFavoriteTrainer(userId: string, trainerId: string): Promise<FavoriteTrainerResponse | null>;
  findTrainersWithFavorites(userId?: string): Promise<TrainerWithFavorites[]>;
  findFavoriteTrainerCount(trainerId: string): Promise<number>;
}
