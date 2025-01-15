import { PrismaClient } from '@prisma/client';
import { PROFILES } from '#prisma/mock/profile.mock.js';
import { USERS } from '#prisma/mock/user.mock.js';
import { LESSON_REQUESTS } from './mock/lesson_request.mock.js';

const prisma = new PrismaClient();

async function main() {
  // 1. 기존 데이터 삭제
  console.log('기존 데이터 삭제 중...');
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.lessonQuote.deleteMany();
  await prisma.directQuoteRequest.deleteMany();
  await prisma.lessonRequest.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // 2. User 데이터 삽입
  console.log('User 데이터 삽입 중...');
  await prisma.user.createMany({
    data: USERS,
    skipDuplicates: true,
  });

  // 3. Profile 데이터 삽입
  console.log('Profile 데이터 삽입 중...');
  for (const profile of PROFILES) {
    // 각 Profile 데이터를 개별적으로 삽입하여 외래 키 제약 조건 확인
    await prisma.profile.create({
      data: profile,
    });
  }

  // 4. LessonRequest 데이터 삽입
  console.log('LessonRequest 데이터 삽입 중...');
  for (const lessonRequest of LESSON_REQUESTS) {
    await prisma.lessonRequest.create({
      data: lessonRequest,
    });
  }

  console.log('모든 데이터 삽입 완료!');
}

// 데이터베이스 연결 종료
main()
  .then(async () => {
    console.log('시딩 작업이 성공적으로 완료되었습니다.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('시딩 작업 중 오류 발생:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
