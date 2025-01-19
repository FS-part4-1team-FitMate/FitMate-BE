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

export type TrainerProfile = {
  profileImage: string | null;
  intro: string | null;
  lessonType: string[];
  experience: number | null;
  rating: number | null;
  reviewCount: number | null;
  lessonCount: number | null;
};
export type TrainerWithFavorites = {
  id: string;
  nickname: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  profile: TrainerProfile | null;
  favoritedByUsers?: { userId: string }[];
};
