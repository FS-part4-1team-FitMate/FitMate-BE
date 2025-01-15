/*
  Warnings:

  - You are about to drop the `DirectLessonRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DirectLessonRequest" DROP CONSTRAINT "DirectLessonRequest_lessonRequestId_fkey";

-- DropForeignKey
ALTER TABLE "DirectLessonRequest" DROP CONSTRAINT "DirectLessonRequest_trainerId_fkey";

-- DropTable
DROP TABLE "DirectLessonRequest";

-- CreateTable
CREATE TABLE "DirectQuoteRequest" (
    "id" TEXT NOT NULL,
    "lessonRequestId" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DirectQuoteRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DirectQuoteRequest" ADD CONSTRAINT "DirectQuoteRequest_lessonRequestId_fkey" FOREIGN KEY ("lessonRequestId") REFERENCES "LessonRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectQuoteRequest" ADD CONSTRAINT "DirectQuoteRequest_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
