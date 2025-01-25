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

export type MyReviewResponse = {
  nickname: string;
  createdAt: Date;
  price: number;
  profileImage: string;
  quoteEndDate: Date;
  content: string;
  lessonType: string;
};
