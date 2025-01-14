import { PrismaClient } from '@prisma/client';
import { PROFILES } from '#prisma/mock/profile.mock.js';
import { USERS } from '#prisma/mock/user.mock.js';

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.lessonQuote.deleteMany();
  await prisma.directLessonRequest.deleteMany();
  await prisma.lessonRequest.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // 목 데이터 삽입
  await prisma.user.createMany({
    data: USERS,
    skipDuplicates: true,
  });
  await prisma.profile.createMany({
    data: PROFILES,
    skipDuplicates: true,
  });
}

// 데이터베이스와의 연결 종료
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
