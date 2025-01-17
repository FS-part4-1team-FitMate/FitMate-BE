import {
  CreateFavoriteTrainer,
  RemoveFavoriteTrainer,
  FavoriteTrainerResponse,
} from '#trainer/type/trainer.type.js';

export interface ITrainerRepository {
  findAll(
    userId: string | null,
    where: Record<string, any>,
    orderBy: Record<string, string>,
    skip: number,
    take: number,
  ): Promise<any[]>;
  count(where: Record<string, any>): Promise<number>;
  addFavoriteTrainer(userId: string, data: CreateFavoriteTrainer): Promise<FavoriteTrainerResponse>;
  removeFavoriteTrainer(userId: string, data: RemoveFavoriteTrainer): Promise<void>;
  findFavoriteTrainer(userId: string, trainerId: string): Promise<FavoriteTrainerResponse | null>;
  countTrainers(): Promise<number>;
  findTrainersWithFavorites(userId?: string): Promise<any[]>;
}
