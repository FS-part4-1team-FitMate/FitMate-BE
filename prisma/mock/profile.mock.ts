import { Gender, LessonType, Region } from '@prisma/client';

export const PORFILES = [
  {
    id: '699fc386-d1a7-4430-a37d-9d1c5bdafd3f',
    userId: '699fc386-d1a7-4430-a37d-9d1c5bdafd3f',
    name: '유저01',
    profileImage: '',
    gender: Gender.FEMALE,
    lessonType: [LessonType.FITNESS],
    region: [Region.SEOUL],
    intro: '',
    description: '',
    certification: '',
    certificationValidated: false,
  },
];
