/*
  Warnings:

  - You are about to drop the column `recurringPaymentId` on the `CardTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `recurringPaymentId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `RecurringPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CardTransaction" DROP CONSTRAINT "CardTransaction_recurringPaymentId_fkey";

-- DropForeignKey
ALTER TABLE "RecurringPayment" DROP CONSTRAINT "RecurringPayment_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "RecurringPayment" DROP CONSTRAINT "RecurringPayment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_recurringPaymentId_fkey";

-- DropIndex
DROP INDEX "CardTransaction_recurringPaymentId_idx";

-- DropIndex
DROP INDEX "Transaction_recurringPaymentId_idx";

-- AlterTable
ALTER TABLE "CardTransaction" DROP COLUMN "recurringPaymentId";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "recurringPaymentId";

-- DropTable
DROP TABLE "RecurringPayment";

-- DropEnum
DROP TYPE "PaymentSource";
