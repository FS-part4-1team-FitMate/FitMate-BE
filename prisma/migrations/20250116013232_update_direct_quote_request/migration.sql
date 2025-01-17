/*
  Warnings:

  - A unique constraint covering the columns `[lessonRequestId,trainerId]` on the table `DirectQuoteRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DirectQuoteRequest_lessonRequestId_trainerId_key" ON "DirectQuoteRequest"("lessonRequestId", "trainerId");
