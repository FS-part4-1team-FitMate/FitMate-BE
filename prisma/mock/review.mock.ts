import { Review } from '@prisma/client';

export const REVIEWS: Review[] = [
  {
    id: '11f489c0-a951-44c4-8d52-bec26edf0bbe', // user01의 완료된 레슨
    userId: '699fc386-d1a7-4430-a37d-9d1c5bdafd3f', // User01
    lessonQuoteId: '8df489c0-a951-44c4-8d52-bec26edf0ccd', // trainer01 완료된 레슨
    rating: 5,
    content: '훌륭한 강사입니다! 적극 추천합니다.',
    createdAt: new Date('2025-02-05T10:00:00+09:00'),
    updatedAt: new Date('2025-02-05T10:00:00+09:00'),
  },
  {
    id: 'b2c3d4e5-f6a7-48b9-bc10-3a11de12f013', // User01의 완료된 요청레슨
    userId: '699fc386-d1a7-4430-a37d-9d1c5bdafd3f', // User01
    lessonQuoteId: '11f489c0-a951-44c4-8d52-bec26edf0bbe', // trainer01 완료된 레슨
    rating: 4,
    content: '강사님이 친절하고 꼼꼼하게 가르쳐주십니다.',
    createdAt: new Date('2025-01-29T12:00:00+09:00'),
    updatedAt: new Date('2025-01-29T12:00:00+09:00'),
  },
  {
    id: 'c3d4e5f6-a7b8-49c9-9010-4a11de12b013', // User03의 완료된 요청레슨
    userId: '399fc386-d1a7-4430-a37d-9d1c5bdafd3d', // User03
    lessonQuoteId: '673805e8-2c0a-4ec0-9edd-034db8563474', // trainer01 완료된 레슨
    rating: 5,
    content: '수업이 체계적이고 효과적이었어요!',
    createdAt: new Date('2025-01-20T15:30:00+09:00'),
    updatedAt: new Date('2025-01-20T15:30:00+09:00'),
  },
  {
    id: 'd4e5f6a7-b8c9-40d0-9110-5a12de13b014',
    userId: '399fc386-d1a7-4430-a37d-9d1c5bdafd3d', // User03
    lessonQuoteId: '1a1f489c0-a951-44c4-8d52-bec26edf0ccd', // trainer01 완료된 레슨
    rating: 3,
    content: '수업 내용은 좋았지만 시간이 부족했습니다.',
    createdAt: new Date('2025-01-19T08:45:00+09:00'),
    updatedAt: new Date('2025-01-19T08:45:00+09:00'),
  },
  {
    id: 'e5f6a7b8-c9d0-41e1-9210-6a13de14b015',
    userId: '449fc386-d1a7-4430-a37d-9d1c5bdafd4d', // User04
    lessonQuoteId: '33e489c0-a951-44c4-8d52-bec26edf0ff1', // trainer02 완료된 레슨
    rating: 5,
    content: '전문적인 강의와 친절한 응대에 만족합니다.',
    createdAt: new Date('2025-01-22T10:15:00+09:00'),
    updatedAt: new Date('2025-01-22T10:15:00+09:00'),
  },
];
