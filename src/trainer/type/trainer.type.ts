export type CreateFavoriteTrainer = {
  trainerId: string;
};

export type RemoveFavoriteTrainer = {
  trainerId: string;
};

export type FavoriteTrainerResponse = {
  id: string;
  userId: string;
  trainerId: string;
  createdAt: Date;
  updatedAt: Date;
};
