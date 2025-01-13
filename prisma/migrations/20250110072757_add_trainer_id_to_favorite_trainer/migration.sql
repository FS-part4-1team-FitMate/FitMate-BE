/*
  Warnings:

  - Added the required column `trainerId` to the `FavoriteTrainer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FavoriteTrainer" ADD COLUMN     "trainerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FavoriteTrainer" ADD CONSTRAINT "FavoriteTrainer_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
