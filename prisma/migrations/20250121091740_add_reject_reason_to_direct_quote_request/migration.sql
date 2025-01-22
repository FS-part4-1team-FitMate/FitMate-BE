-- CreateEnum
CREATE TYPE "DirectQuoteRequestStatus" AS ENUM ('PENDING', 'REJECTED');

-- AlterTable
ALTER TABLE "DirectQuoteRequest" ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "status" "DirectQuoteRequestStatus" NOT NULL DEFAULT 'PENDING';
