/*
  Warnings:

  - A unique constraint covering the columns `[userId,trainerId]` on the table `FavoriteTrainer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FavoriteTrainer_userId_trainerId_key" ON "FavoriteTrainer"("userId", "trainerId");
