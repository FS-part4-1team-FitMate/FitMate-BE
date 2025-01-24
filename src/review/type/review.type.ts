export type CreateReview = {
  lessonQuoteId: string;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ReviewResponse = {
  nickanme: string;
  rating: number;
  content: string;
  createdAt: Date;
};
