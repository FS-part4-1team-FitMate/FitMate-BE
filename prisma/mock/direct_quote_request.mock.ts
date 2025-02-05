import { DirectQuoteRequestStatus } from '@prisma/client';

const convertKstToUtc = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
) => {
  return new Date(Date.UTC(year, month - 1, day, hour - 9, minute, second)); // 9시간 빼서 UTC 변환
};

export const DIRECT_QUOTE_REQUESTS = [
  {
    id: '2f41baba-9266-43d2-82a4-38fc5f4f6be3',
    lessonRequestId: '699fc386-d1a7-4430-a37d-9d1c5bdafd01', // user01의 대기중인 레슨
    trainerId: '66752641-132b-4ec3-ab67-bb2116cc3c94', // trainer06
    status: DirectQuoteRequestStatus.PENDING,
    rejectionReason: null,
    createdAt: convertKstToUtc(2025, 2, 5, 15, 34, 13),
    updatedAt: convertKstToUtc(2025, 2, 5, 15, 34, 13),
  },
];
