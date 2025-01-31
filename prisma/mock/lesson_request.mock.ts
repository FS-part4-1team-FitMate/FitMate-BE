import { LessonType, LessonSubType, LocationType, LessonRequestStatus } from '@prisma/client';

export const LESSON_REQUESTS = [
  {
    id: '12345678-d1a7-4430-a37d-9d1c5bdafd13', // 만료된 레슨
    userId: '699fc386-d1a7-4430-a37d-9d1c5bdafd3f', //  User01 // 여하늘
    lessonType: LessonType.REHAB,
    lessonSubType: LessonSubType.STRETCHING,
    startDate: new Date('2025-01-24T09:00:00.000Z'),
    endDate: new Date('2025-01-30T16:00:00.000Z'),
    lessonCount: 6,
    lessonTime: 50,
    quoteEndDate: new Date('2025-01-23T23:59:59.000Z'),
    locationType: LocationType.ONLINE,
    postcode: null,
    roadAddress: null,
    detailAddress: null,
    status: LessonRequestStatus.EXPIRED,
    createdAt: new Date('2025-01-22T06:00:00.000Z'),
    updatedAt: new Date('2025-01-22T06:00:00.000Z'),
  },
  {
    id: '6ccfc386-d1a7-4430-a37d-9d1c5bdafd01', // 완료된 레슨
    userId: '699fc386-d1a7-4430-a37d-9d1c5bdafd3f', // User01 // 여하늘
    lessonType: LessonType.FITNESS,
    lessonSubType: LessonSubType.PILATES,
    startDate: new Date('2025-01-24T10:00:00.000Z'),
    endDate: new Date('2025-01-28T23:59:59.000Z'),
    lessonCount: 5,
    lessonTime: 40,
    quoteEndDate: new Date('2025-01-23T23:59:59.000Z'),
    locationType: LocationType.OFFLINE,
    postcode: '13529',
    roadAddress: '경기 성남시 분당구 판교역로 166',
    detailAddress: '101호',
    status: LessonRequestStatus.COMPLETED,
    createdAt: new Date('2025-01-11T12:00:00.000Z'),
    updatedAt: new Date('2025-01-11T12:00:00.000Z'),
  },
  {
    id: '699fc386-d1a7-4430-a37d-9d1c5bdafd01', // 요청중인 레슨
    userId: '699fc386-d1a7-4430-a37d-9d1c5bdafd3f', // User01 // 여하늘
    lessonType: LessonType.FITNESS,
    lessonSubType: LessonSubType.PILATES,
    startDate: new Date('2025-02-05T10:00:00.000Z'),
    endDate: new Date('2025-02-11T23:59:59.000Z'),
    lessonCount: 5,
    lessonTime: 40,
    quoteEndDate: new Date('2025-02-04T23:59:59.000Z'),
    locationType: LocationType.OFFLINE,
    postcode: '13529',
    roadAddress: '경기 성남시 분당구 판교역로 166',
    detailAddress: '101호',
    status: LessonRequestStatus.PENDING,
    createdAt: new Date('2025-01-11T12:00:00.000Z'),
    updatedAt: new Date('2025-01-11T12:00:00.000Z'),
  },
  {
    id: '699fc386-d1a7-4430-a37d-9d1c5bdafd02', // 만료(EXPIRED)된 레슨
    userId: '699fc386-d1a7-4430-a37d-9d1c5bdafd4d', // User02 // 남하늘
    lessonType: LessonType.SPORTS,
    lessonSubType: LessonSubType.TENNIS,
    startDate: new Date('2025-01-23T10:00:00.000Z'),
    endDate: new Date('2025-01-24T23:59:59.000Z'),
    lessonCount: 3,
    lessonTime: 60,
    quoteEndDate: new Date('2025-01-22T23:59:59.000Z'),
    locationType: LocationType.OFFLINE,
    postcode: '12345',
    roadAddress: '서울 강남구 테헤란로 123',
    detailAddress: '202호',
    status: LessonRequestStatus.EXPIRED,
    createdAt: new Date('2025-01-12T12:00:00.000Z'),
    updatedAt: new Date('2025-01-12T12:00:00.000Z'),
  },
  {
    id: '399fc386-d1a7-4430-a37d-9d1c5bdafd04', // 완료된 레슨  // trainer01 견적 선택
    userId: '399fc386-d1a7-4430-a37d-9d1c5bdafd3d', // User03 // 박다솔
    lessonType: LessonType.FITNESS,
    lessonSubType: LessonSubType.YOGA,
    startDate: new Date('2025-01-15T07:00:00.000Z'),
    endDate: new Date('2025-01-16T12:00:00.000Z'),
    lessonCount: 2,
    lessonTime: 16,
    quoteEndDate: new Date('2025-01-14T23:59:59.000Z'),
    locationType: LocationType.OFFLINE,
    postcode: '67890',
    roadAddress: '부산 해운대구 센텀중앙로 55',
    detailAddress: '303호',
    status: LessonRequestStatus.COMPLETED,
    createdAt: new Date('2025-01-12T13:00:00.000Z'),
    updatedAt: new Date('2025-01-12T13:00:00.000Z'),
  },
  {
    id: '399fc386-d1a7-4430-a37d-9d1c5bdafd03', // 완료된 레슨  // trainer01 견적 선택
    userId: '399fc386-d1a7-4430-a37d-9d1c5bdafd3d', // User03 // 박다솔
    lessonType: LessonType.SPORTS,
    lessonSubType: LessonSubType.TENNIS,
    startDate: new Date('2025-01-18T09:00:00.000Z'),
    endDate: new Date('2025-01-18T18:00:00.000Z'),
    lessonCount: 1,
    lessonTime: 8,
    quoteEndDate: new Date('2025-01-17T23:59:59.000Z'),
    locationType: LocationType.ONLINE,
    postcode: null,
    roadAddress: null,
    detailAddress: null,
    status: LessonRequestStatus.COMPLETED,
    createdAt: new Date('2025-01-17T12:00:00.000Z'),
    updatedAt: new Date('2025-01-17T12:00:00.000Z'),
  },
  {
    id: '699fc386-d1a7-4430-a37d-9d1c5bdafd03', // 완료된 레슨  // trainer01 견적 선택
    userId: '399fc386-d1a7-4430-a37d-9d1c5bdafd3d', // User03 // 박다솔
    lessonType: LessonType.REHAB,
    lessonSubType: LessonSubType.STRETCHING,
    startDate: new Date('2025-01-22T09:00:00.000Z'),
    endDate: new Date('2025-01-22T18:00:00.000Z'),
    lessonCount: 1,
    lessonTime: 8,
    quoteEndDate: new Date('2025-01-21T23:59:59.000Z'),
    locationType: LocationType.ONLINE,
    postcode: null,
    roadAddress: null,
    detailAddress: null,
    status: LessonRequestStatus.COMPLETED,
    createdAt: new Date('2025-01-19T12:00:00.000Z'),
    updatedAt: new Date('2025-01-19T12:00:00.000Z'),
  },
  {
    id: '699fc386-d1a7-4430-a37d-9d1c5bdafd04', // 완료된 레슨  // trainer02 견적 선택
    userId: '449fc386-d1a7-4430-a37d-9d1c5bdafd4d', // User04 // 박지훈
    lessonType: LessonType.FITNESS,
    lessonSubType: LessonSubType.PERSONAL_TRAINING,
    startDate: new Date('2025-01-15T07:00:00.000Z'),
    endDate: new Date('2025-01-16T12:00:00.000Z'),
    lessonCount: 2,
    lessonTime: 16,
    quoteEndDate: new Date('2025-01-14T23:59:59.000Z'),
    locationType: LocationType.OFFLINE,
    postcode: '67890',
    roadAddress: '부산 해운대구 센텀중앙로 55',
    detailAddress: '303호',
    status: LessonRequestStatus.COMPLETED,
    createdAt: new Date('2025-01-12T13:00:00.000Z'),
    updatedAt: new Date('2025-01-12T13:00:00.000Z'),
  },
  {
    id: '699fc386-d1a7-4430-a37d-9d1c5bdafd05', // 요청중인 레슨
    userId: '559fc386-d1a7-4430-a37d-9d1c5bdafd4d', // User05 // 강다은
    lessonType: LessonType.SPORTS,
    lessonSubType: LessonSubType.BOXING,
    startDate: new Date('2025-02-04T09:00:00.000Z'),
    endDate: new Date('2025-02-07T18:00:00.000Z'),
    lessonCount: 3,
    lessonTime: 24,
    quoteEndDate: new Date('2025-02-03T23:59:59.000Z'),
    locationType: LocationType.OFFLINE,
    postcode: '10101',
    roadAddress: '제주 서귀포시 칠십리로 1',
    detailAddress: '404호',
    status: LessonRequestStatus.PENDING,
    createdAt: new Date('2025-01-14T12:00:00.000Z'),
    updatedAt: new Date('2025-01-14T12:00:00.000Z'),
  },
  {
    id: '699fc386-d1a7-4430-a37d-9d1c5bdafd06',
    userId: '669fc386-d1a7-4430-a37d-9d1c5bdafd4d', // User06 // 장우진
    lessonType: LessonType.FITNESS,
    lessonSubType: LessonSubType.DIET_MANAGEMENT,
    startDate: new Date('2025-02-06T10:00:00.000Z'),
    endDate: new Date('2025-02-12T20:00:00.000Z'),
    lessonCount: 5,
    lessonTime: 40,
    quoteEndDate: new Date('2025-02-05T23:59:59.000Z'),
    locationType: LocationType.ONLINE,
    postcode: null,
    roadAddress: null,
    detailAddress: null,
    status: LessonRequestStatus.PENDING,
    createdAt: new Date('2025-01-31T13:00:00.000Z'),
    updatedAt: new Date('2025-01-31T13:00:00.000Z'),
  },
  {
    id: '12345678-d1a7-4430-a37d-9d1c5bdafd07',
    userId: '12345678-1234-1234-1234-123456789001', // User07 // 최유진
    lessonType: LessonType.FITNESS,
    lessonSubType: LessonSubType.YOGA,
    startDate: new Date('2025-02-04T10:00:00.000Z'),
    endDate: new Date('2025-02-09T18:00:00.000Z'),
    lessonCount: 4,
    lessonTime: 32,
    quoteEndDate: new Date('2025-02-03T23:59:59.000Z'),
    locationType: LocationType.OFFLINE,
    postcode: '12345',
    roadAddress: '서울 강남구 삼성로 123',
    detailAddress: '101호',
    status: LessonRequestStatus.PENDING,
    createdAt: new Date('2025-01-15T00:00:00.000Z'),
    updatedAt: new Date('2025-01-15T00:00:00.000Z'),
  },
  {
    id: '12345678-d1a7-4430-a37d-9d1c5bdafd08',
    userId: '12345678-1234-1234-1234-123456789002', // User08 // 김동현
    lessonType: LessonType.SPORTS,
    lessonSubType: LessonSubType.SOCCER,
    startDate: new Date('2025-02-05T08:00:00.000Z'),
    endDate: new Date('2025-02-10T17:00:00.000Z'),
    lessonCount: 4,
    lessonTime: 90,
    quoteEndDate: new Date('2025-02-04T23:59:59.000Z'),
    locationType: LocationType.OFFLINE,
    postcode: '54321',
    roadAddress: '경기 성남시 분당구 정자동 456',
    detailAddress: '202호',
    status: LessonRequestStatus.PENDING,
    createdAt: new Date('2025-01-15T01:00:00.000Z'),
    updatedAt: new Date('2025-01-15T01:00:00.000Z'),
  },
  {
    id: '12345678-d1a7-4430-a37d-9d1c5bdafd09',
    userId: '12345678-1234-1234-1234-123456789003', // User09 // 박지우
    lessonType: LessonType.REHAB,
    lessonSubType: LessonSubType.REHAB_TREATMENT,
    startDate: new Date('2025-02-04T09:00:00.000Z'),
    endDate: new Date('2025-02-20T15:00:00.000Z'),
    lessonCount: 6,
    lessonTime: 45,
    quoteEndDate: new Date('2025-02-03T23:59:59.000Z'),
    locationType: LocationType.ONLINE,
    postcode: null,
    roadAddress: null,
    detailAddress: null,
    status: LessonRequestStatus.PENDING,
    createdAt: new Date('2025-01-15T02:00:00.000Z'),
    updatedAt: new Date('2025-01-15T02:00:00.000Z'),
  },
  {
    id: '12345678-d1a7-4430-a37d-9d1c5bdafd10',
    userId: '12345678-1234-1234-1234-123456789004', // User10 // 이민호
    lessonType: LessonType.FITNESS,
    lessonSubType: LessonSubType.PERSONAL_TRAINING,
    startDate: new Date('2025-02-06T06:00:00.000Z'),
    endDate: new Date('2025-02-14T18:00:00.000Z'),
    lessonCount: 7,
    lessonTime: 40,
    quoteEndDate: new Date('2025-02-05T23:59:59.000Z'),
    locationType: LocationType.OFFLINE,
    postcode: '67890',
    roadAddress: '부산 해운대구 센텀동로 789',
    detailAddress: '303호',
    status: LessonRequestStatus.PENDING,
    createdAt: new Date('2025-01-15T03:00:00.000Z'),
    updatedAt: new Date('2025-01-15T03:00:00.000Z'),
  },
  {
    id: '12345678-d1a7-4430-a37d-9d1c5bdafd11',
    userId: '12345678-1234-1234-1234-123456789005', // User11 // 정서윤
    lessonType: LessonType.SPORTS,
    lessonSubType: LessonSubType.BASKETBALL,
    startDate: new Date('2025-02-26T07:00:00.000Z'),
    endDate: new Date('2025-02-28T20:00:00.000Z'),
    lessonCount: 3,
    lessonTime: 80,
    quoteEndDate: new Date('2025-02-25T23:59:59.000Z'),
    locationType: LocationType.ONLINE,
    postcode: null,
    roadAddress: null,
    detailAddress: null,
    status: LessonRequestStatus.PENDING,
    createdAt: new Date('2025-01-15T04:00:00.000Z'),
    updatedAt: new Date('2025-01-15T04:00:00.000Z'),
  },
  {
    id: '12345678-d1a7-4430-a37d-9d1c5bdafd12',
    userId: '12345678-1234-1234-1234-123456789006', // User12 // 강현우
    lessonType: LessonType.FITNESS,
    lessonSubType: LessonSubType.DIET_MANAGEMENT,
    startDate: new Date('2025-01-29T08:00:00.000Z'),
    endDate: new Date('2025-02-05T17:00:00.000Z'),
    lessonCount: 5,
    lessonTime: 60,
    quoteEndDate: new Date('2025-01-28T23:59:59.000Z'),
    locationType: LocationType.OFFLINE,
    postcode: '55555',
    roadAddress: '경남 창원시 의창구 중앙대로 456',
    detailAddress: '404호',
    status: LessonRequestStatus.PENDING,
    createdAt: new Date('2025-01-15T05:00:00.000Z'),
    updatedAt: new Date('2025-01-15T05:00:00.000Z'),
  },
];
