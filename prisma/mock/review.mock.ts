import { Review } from '@prisma/client';

export const REVIEWS: Review[] = [
  {
    id: '11r489c0-a951-44c4-8d52-bec26edf0bbe', //user01의 완료된 레슨
    userId: '699fc386-d1a7-4430-a37d-9d1c5bdafd3f', // User01
    lessonQuoteId: '8df489c0-a951-44c4-8d52-bec26edf0ccd', // trainer01 완료된 레슨
    rating: 5,
    content: '훌륭한 강사입니다! 적극 추천합니다.',
    createdAt: new Date('2025-02-05T10:00:00.000Z'),
    updatedAt: new Date('2025-02-05T10:00:00.000Z'),
  },
  {
    id: 'b2c3d4e5-f6g7-h8i9-jk10-lm11no12pqr13', // User01의 완료된 요청레슨
    userId: '699fc386-d1a7-4430-a37d-9d1c5bdafd3f', // User01
    lessonQuoteId: '11g489c0-a951-44c4-8d52-bec26edf0bbe', // trainer01 완료된 레슨
    rating: 4,
    content: '강사님이 친절하고 꼼꼼하게 가르쳐주십니다.',
    createdAt: new Date('2025-01-29T12:00:00.000Z'),
    updatedAt: new Date('2025-01-29T12:00:00.000Z'),
  },
  {
    id: 'c3d4e5f6-g7h8-i9j10-k11lm12no13pqr14', // User03의 완료된 요청레슨
    userId: '399fc386-d1a7-4430-a37d-9d1c5bdafd3d', // User03
    lessonQuoteId: '673805e8-2c0a-4ec0-9edd-034db8563474', // trainer01 완료된 레슨
    rating: 5,
    content: '수업이 체계적이고 효과적이었어요!',
    createdAt: new Date('2025-01-20T15:30:00.000Z'),
    updatedAt: new Date('2025-01-20T15:30:00.000Z'),
  },
  {
    id: 'd4e5f6g7-h8i9-j10k11-lm12no13pqr15',
    userId: '399fc386-d1a7-4430-a37d-9d1c5bdafd3d', // User03
    lessonQuoteId: '1a1f489c0-a951-44c4-8d52-bec26edf0ccd', // trainer01 완료된 레슨
    rating: 3,
    content: '수업 내용은 좋았지만 시간이 부족했습니다.',
    createdAt: new Date('2025-01-19T08:45:00.000Z'),
    updatedAt: new Date('2025-01-19T08:45:00.000Z'),
  },
  {
    id: 'e5f6g7h8-i9j10-k11lm12-no13pqr16',
    userId: '449fc386-d1a7-4430-a37d-9d1c5bdafd4d', // User04
    lessonQuoteId: '8df489c0-a951-44c4-8d52-bec26edf0ffg', // trainer02 완료된 레슨
    rating: 5,
    content: '전문적인 강의와 친절한 응대에 만족합니다.',
    createdAt: new Date('2025-01-22T10:15:00.000Z'),
    updatedAt: new Date('2025-01-22T10:15:00.000Z'),
  },
];
