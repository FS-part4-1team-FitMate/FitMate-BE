export type CreateFavoriteTrainer = {
  trainerId: string; // 찜할 강사의 ID
};

export type RemoveFavoriteTrainer = {
  trainerId: string; // 찜에서 제거할 강사의 ID
};

export type FavoriteTrainerResponse = {
  id: string;
  userId: string;
  trainerId: string;
  createdAt: Date;
  updatedAt: Date;
};
