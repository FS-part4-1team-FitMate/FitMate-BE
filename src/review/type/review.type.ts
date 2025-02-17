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
  rating: number;
  content: string;
  createdAt: Date;
  lessonQuote: {
    price: number;
    trainer: {
      nickname: string;
      profile: {
        profileImage: string | null;
      } | null;
    };
    lessonRequest: {
      quoteEndDate: Date;
      lessonType: string;
    };
  };
};
