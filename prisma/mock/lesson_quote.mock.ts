import { QuoteStatus } from '@prisma/client';

const formatToTime = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
) => {
  return new Date(Date.UTC(year, month - 1, day, hour - 9, minute, second));
};

export const LESSON_QUOTES = [
  {
    id: '11g489c0-a951-44c4-8d52-bec26edf0bbe', // user01의 완료된 레슨에 대한 견적
    trainerId: '11752641-132b-4ec3-ab67-bb2116cc3c94',
    lessonRequestId: '6ccfc386-d1a7-4430-a37d-9d1c5bdafd01',
    price: 110000.0,
    message: 'trainer01 견적 드립니다. 긍정적인 검토 부탁드립니다.',
    status: QuoteStatus.ACCEPTED,
    rejectionReason: null,
    createdAt: formatToTime(2025, 1, 21, 11, 0, 0),
    updatedAt: formatToTime(2025, 1, 21, 11, 0, 0),
  },
  {
    id: 'd695d222-7486-44a7-b851-5ffae053d8c8', // user01의 완료된 레슨에 대한 견적
    trainerId: '22752641-132b-4ec3-ab67-bb2116cc3c94',
    lessonRequestId: '6ccfc386-d1a7-4430-a37d-9d1c5bdafd01',
    price: 120000.0,
    message: 'trainer02 견적 드립니다. 긍정적인 검토 부탁드립니다.',
    status: QuoteStatus.PENDING,
    rejectionReason: null,
    createdAt: formatToTime(2025, 1, 21, 13, 0, 0),
    updatedAt: formatToTime(2025, 1, 21, 13, 0, 0),
  },
  {
    id: '8df489c0-a951-44c4-8d52-bec26edf0bbe', // user01의 대기중인 요청레슨에 대한 견적
    trainerId: '11752641-132b-4ec3-ab67-bb2116cc3c94',
    lessonRequestId: '699fc386-d1a7-4430-a37d-9d1c5bdafd01',
    price: 110000.0,
    message: 'trainer01 견적 드립니다. 긍정적인 검토 부탁드립니다.',
    status: QuoteStatus.PENDING,
    rejectionReason: null,
    createdAt: formatToTime(2025, 2, 1, 11, 0, 0),
    updatedAt: formatToTime(2025, 2, 1, 11, 0, 0),
  },
  {
    id: 'd695d827-7486-44a7-b851-5ffae053d8c8', // user01의 대기중인 요청레슨에 대한 견적
    trainerId: '22752641-132b-4ec3-ab67-bb2116cc3c94',
    lessonRequestId: '699fc386-d1a7-4430-a37d-9d1c5bdafd01',
    price: 120000.0,
    message: 'trainer02 견적 드립니다. 긍정적인 검토 부탁드립니다.',
    status: QuoteStatus.PENDING,
    rejectionReason: null,
    createdAt: formatToTime(2025, 2, 2, 11, 0, 0),
    updatedAt: formatToTime(2025, 2, 2, 11, 0, 0),
  },
  {
    id: 'dbe3d4c4-dc14-43d3-9197-74744b5e5d51', // user01의 대기중인 요청레슨에 대한 견적적
    trainerId: '33752641-132b-4ec3-ab67-bb2116cc3c94',
    lessonRequestId: '699fc386-d1a7-4430-a37d-9d1c5bdafd01',
    price: 130000.0,
    message: 'trainer03 견적 드립니다. 긍정적인 검토 부탁드립니다.',
    status: QuoteStatus.PENDING,
    rejectionReason: null,
    createdAt: formatToTime(2025, 2, 3, 11, 0, 0),
    updatedAt: formatToTime(2025, 2, 3, 11, 0, 0),
  },
  {
    id: 'dc7a3d08-7735-49e7-94c7-c1347382f23d', // user01의 대기중인 요청레슨에 대한 견적
    trainerId: '44752641-132b-4ec3-ab67-bb2116cc3c94',
    lessonRequestId: '699fc386-d1a7-4430-a37d-9d1c5bdafd01',
    price: 140000.0,
    message: 'trainer04 견적 드립니다. 긍정적인 검토 부탁드립니다.',
    status: QuoteStatus.PENDING,
    rejectionReason: null,
    createdAt: formatToTime(2025, 2, 4, 11, 0, 0),
    updatedAt: formatToTime(2025, 2, 4, 11, 0, 0),
  },
  {
    id: '673805e8-2c0a-4ec0-9edd-034db8563474', // User03의 완료된 요청레슨에 대한 견적
    trainerId: '11752641-132b-4ec3-ab67-bb2116cc3c94',
    lessonRequestId: '399fc386-d1a7-4430-a37d-9d1c5bdafd04',
    price: 160000.0,
    message: 'trainer01 견적 드립니다. 긍정적인 검토 부탁드립니다.',
    status: QuoteStatus.ACCEPTED,
    rejectionReason: null,
    createdAt: formatToTime(2025, 1, 13, 11, 0, 0),
    updatedAt: formatToTime(2025, 1, 13, 11, 0, 0),
  },
  {
    id: '1a1f489c0-a951-44c4-8d52-bec26edf0ccd', // User03의 완료된 요청레슨에 대한 견적
    trainerId: '11752641-132b-4ec3-ab67-bb2116cc3c94',
    lessonRequestId: '399fc386-d1a7-4430-a37d-9d1c5bdafd03',
    price: 130000.0,
    message: 'trainer01 완료된 레슨.',
    status: QuoteStatus.ACCEPTED,
    rejectionReason: null,
    createdAt: formatToTime(2025, 1, 17, 16, 30, 0),
    updatedAt: formatToTime(2025, 1, 17, 16, 30, 0),
  },
  {
    id: '8df489c0-a951-44c4-8d52-bec26edf0ccd', //user01의 완료된 레슨
    trainerId: '11752641-132b-4ec3-ab67-bb2116cc3c94',
    lessonRequestId: '699fc386-d1a7-4430-a37d-9d1c5bdafd03',
    price: 110000.0,
    message: 'trainer01 진행중인 레슨 완료됨.',
    status: QuoteStatus.ACCEPTED,
    rejectionReason: null,
    createdAt: new Date('2025-02-02T16:30:12.460Z'),
    updatedAt: new Date('2025-02-02T16:30:12.460Z'),
  },
  {
    id: '8df489c0-a951-44c4-8d52-bec26edf0ffg', //  User04 완료된 요청레슨
    trainerId: '22752641-132b-4ec3-ab67-bb2116cc3c94',
    lessonRequestId: '699fc386-d1a7-4430-a37d-9d1c5bdafd04',
    price: 110000.0,
    message: 'trainer02 완료된 레슨.',
    status: QuoteStatus.ACCEPTED,
    rejectionReason: null,
    createdAt: new Date('2025-01-17T09:30:12.460Z'),
    updatedAt: new Date('2025-01-17T09:30:12.460Z'),
  },
  {
    id: '9ef489c0-a951-44c4-8d52-bec26edf0ffg', //  User05 완료된 요청레슨
    trainerId: '22752641-132b-4ec3-ab67-bb2116cc3c94',
    lessonRequestId: '699fc386-d1a7-4430-a37d-9d1c5bdafd05',
    price: 110000.0,
    message: 'trainer03 완료된 레슨.',
    status: QuoteStatus.ACCEPTED,
    rejectionReason: null,
    createdAt: new Date('2025-02-02T08:30:12.460Z'),
    updatedAt: new Date('2025-02-02T16:30:12.460Z'),
  },
  {
    id: '33e489c0-a951-44c4-8d52-bec26edf0ffg', //  User02 견적확정 요청레슨
    trainerId: '22752641-132b-4ec3-ab67-bb2116cc3c94',
    lessonRequestId: '259fc386-d1a7-4430-a37d-9d1c5bdafd02',
    price: 150000.0,
    message: 'trainer03 견적확정 레슨.',
    status: QuoteStatus.ACCEPTED,
    rejectionReason: null,
    createdAt: new Date('2025-02-08T08:30:12.460Z'),
    updatedAt: new Date('2025-02-08T16:30:12.460Z'),
  },
];
