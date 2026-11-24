-- CreateEnum
CREATE TYPE "PaymentSource" AS ENUM ('bank', 'card');

-- AlterTable
ALTER TABLE "RecurringPayment" ADD COLUMN     "source" "PaymentSource" NOT NULL DEFAULT 'bank';
