import { Gender, LessonType, Region } from '@prisma/client';

export const PROFILES = [
  // Regular user profiles
  {
    id: 'pro01386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '699fc386-d1a7-4430-a37d-9d1c5bdafd3f', // User01
    name: '여하늘',
    profileImage: '',
    phone: '010-1234-5678',
    gender: Gender.FEMALE,
    lessonType: [LessonType.FITNESS],
    region: [Region.SEOUL],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
    rating: 4.25,
  },
  {
    id: 'pro02386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '699fc386-d1a7-4430-a37d-9d1c5bdafd4d', // User02
    name: '남하늘',
    profileImage: '',
    phone: '010-8765-4321',
    gender: Gender.MALE,
    lessonType: [LessonType.FITNESS],
    region: [Region.GYEONGGI],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
    rating: 5,
  },
  {
    id: 'pro03386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '399fc386-d1a7-4430-a37d-9d1c5bdafd3d', // User03
    name: '박다솔',
    profileImage: '',
    phone: '010-1234-9876',
    gender: Gender.FEMALE,
    lessonType: [LessonType.FITNESS],
    region: [Region.INCHEON],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
  },
  {
    id: 'pro04386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '449fc386-d1a7-4430-a37d-9d1c5bdafd4d', // User04
    name: '박지훈',
    profileImage: '',
    phone: '010-8765-6789',
    gender: Gender.MALE,
    lessonType: [LessonType.REHAB],
    region: [Region.BUSAN],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
  },
  {
    id: 'pro05386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '559fc386-d1a7-4430-a37d-9d1c5bdafd4d', // User05
    name: '강다은',
    profileImage: '',
    phone: '010-5678-1234',
    gender: Gender.FEMALE,
    lessonType: [LessonType.SPORTS],
    region: [Region.JEJU],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
  },
  {
    id: 'pro06386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '669fc386-d1a7-4430-a37d-9d1c5bdafd4d', // User06
    name: '장우진',
    profileImage: '',
    phone: '010-4321-8765',
    gender: Gender.MALE,
    lessonType: [LessonType.SPORTS],
    region: [Region.GYEONGNAM],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
  },
  {
    id: 'pro13386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '12345678-1234-1234-1234-123456789001', // User07
    name: '최유진',
    profileImage: '',
    phone: '010-1000-1001',
    gender: Gender.FEMALE,
    lessonType: [LessonType.FITNESS],
    region: [Region.SEOUL],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
  },
  {
    id: 'pro14386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '12345678-1234-1234-1234-123456789002', // User08
    name: '김동현',
    profileImage: '',
    phone: '010-2000-2001',
    gender: Gender.MALE,
    lessonType: [LessonType.SPORTS],
    region: [Region.GYEONGGI],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
  },
  {
    id: 'pro15386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '12345678-1234-1234-1234-123456789003', // User09
    name: '박지우',
    profileImage: '',
    phone: '010-3000-3001',
    gender: Gender.FEMALE,
    lessonType: [LessonType.REHAB],
    region: [Region.INCHEON],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
  },
  {
    id: 'pro16386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '12345678-1234-1234-1234-123456789004', // User10
    name: '이민호',
    profileImage: '',
    phone: '010-4000-4001',
    gender: Gender.MALE,
    lessonType: [LessonType.FITNESS],
    region: [Region.BUSAN],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
  },
  {
    id: 'pro17386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '12345678-1234-1234-1234-123456789005', // User11
    name: '정서윤',
    profileImage: '',
    phone: '010-5000-5001',
    gender: Gender.FEMALE,
    lessonType: [LessonType.SPORTS],
    region: [Region.JEJU],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
  },
  {
    id: 'pro18386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '12345678-1234-1234-1234-123456789006', // User12
    name: '강현우',
    profileImage: '',
    phone: '010-6000-6001',
    gender: Gender.MALE,
    lessonType: [LessonType.SPORTS],
    region: [Region.GYEONGNAM],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
  },
  {
    id: 'pro19386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '12345678-1234-1234-1234-123456789007', // User13
    name: '조윤서',
    profileImage: '',
    phone: '010-7000-7001',
    gender: Gender.FEMALE,
    lessonType: [LessonType.REHAB],
    region: [Region.GANGWON],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
  },
  {
    id: 'pro20386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '12345678-1234-1234-1234-123456789008', // User14
    name: '송다은',
    profileImage: '',
    phone: '010-8000-8001',
    gender: Gender.FEMALE,
    lessonType: [LessonType.SPORTS],
    region: [Region.SEOUL],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
  },
  {
    id: 'pro21386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '12345678-1234-1234-1234-123456789009', // User15
    name: '민준호',
    profileImage: '',
    phone: '010-9000-9001',
    gender: Gender.MALE,
    lessonType: [LessonType.FITNESS],
    region: [Region.GYEONGGI],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
  },
  {
    id: 'pro22386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '12345678-1234-1234-1234-123456789010', // User16
    name: '한예지',
    profileImage: '',
    phone: '010-1000-1002',
    gender: Gender.FEMALE,
    lessonType: [LessonType.REHAB],
    region: [Region.INCHEON],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
  },
  // Trainer profiles
  {
    id: 'pro07386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '11752641-132b-4ec3-ab67-bb2116cc3c94', // Trainer01
    name: '한지우',
    profileImage: '',
    phone: '010-1111-2222',
    gender: Gender.MALE,
    lessonType: [LessonType.FITNESS],
    region: [Region.SEOUL],
    intro: 'Hello, I am Trainer01.',
    description: 'I specialize in fitness training.',
    certification: 'Certified Trainer',
    certificationValidated: true,
  },
  {
    id: 'pro08386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '22752641-132b-4ec3-ab67-bb2116cc3c94', // Trainer02
    name: '윤서현',
    profileImage: '',
    phone: '010-3333-4444',
    gender: Gender.FEMALE,
    lessonType: [LessonType.SPORTS],
    region: [Region.GYEONGGI],
    intro: 'Hello, I am Trainer02.',
    description: 'My focus is on sports training.',
    certification: 'Certified Sports Trainer',
    certificationValidated: true,
  },
  {
    id: 'pro09386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '33752641-132b-4ec3-ab67-bb2116cc3c94', // Trainer03
    name: '송민재',
    profileImage: '',
    phone: '010-5555-6666',
    gender: Gender.MALE,
    lessonType: [LessonType.REHAB],
    region: [Region.BUSAN],
    intro: 'Hello, I am Trainer03.',
    description: 'Rehabilitation training is my specialty.',
    certification: 'Rehab Specialist',
    certificationValidated: true,
  },
  {
    id: 'pro10386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '44752641-132b-4ec3-ab67-bb2116cc3c94', // Trainer04
    name: '김하늘',
    profileImage: '',
    phone: '010-7777-8888',
    gender: Gender.FEMALE,
    lessonType: [LessonType.FITNESS],
    region: [Region.JEJU],
    intro: 'Hello, I am Trainer04.',
    description: 'Yoga and wellness are my expertise.',
    certification: 'Certified Yoga Trainer',
    certificationValidated: true,
  },
  {
    id: 'pro11386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '55752641-132b-4ec3-ab67-bb2116cc3c94', // Trainer05
    name: '강석우',
    profileImage: '',
    phone: '010-9999-0000',
    gender: Gender.MALE,
    lessonType: [LessonType.SPORTS],
    region: [Region.INCHEON],
    intro: 'Hello, I am Trainer05.',
    description: 'I specialize in pilates and core strength.',
    certification: 'Certified Pilates Trainer',
    certificationValidated: true,
  },
  {
    id: 'pro12386-d1a7-4430-a37d-9d1c5bdafd4d',
    userId: '66752641-132b-4ec3-ab67-bb2116cc3c94', // Trainer06
    name: '정수민',
    profileImage: '',
    phone: '010-2222-3333',
    gender: Gender.FEMALE,
    lessonType: [LessonType.FITNESS],
    region: [Region.GANGWON],
    intro: 'Hello, I am Trainer06.',
    description: 'Diet and nutrition management are my strengths.',
    certification: 'Certified Nutrition Specialist',
    certificationValidated: true,
  },
];
