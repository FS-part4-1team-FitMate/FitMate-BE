/*
  Warnings:

  - You are about to drop the column `subLessonType` on the `LessonRequest` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LessonSubType" AS ENUM ('SOCCER', 'BASKETBALL', 'BASEBALL', 'TENNIS', 'BADMINTON', 'TABLE_TENNIS', 'SKI', 'SURFING', 'BOXING', 'TAEKWONDO', 'JIUJITSU', 'PERSONAL_TRAINING', 'YOGA', 'PILATES', 'DIET_MANAGEMENT', 'STRETCHING', 'REHAB_TREATMENT');

-- AlterTable
ALTER TABLE "LessonRequest" DROP COLUMN "subLessonType",
ADD COLUMN     "lessonSubType" "LessonSubType";
