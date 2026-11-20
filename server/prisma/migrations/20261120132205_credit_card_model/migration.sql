/*
  Warnings:

  - You are about to drop the column `cardNumber` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `limit` on the `CreditCard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,cardLast4]` on the table `CreditCard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cardLast4` to the `CreditCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creditLimit` to the `CreditCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterIndex
ALTER INDEX "CreditCard_userId_cardNumber_key" RENAME TO "CreditCard_userId_cardLast4_key";

-- AlterTable
ALTER TABLE "CreditCard" RENAME COLUMN "cardNumber" TO "cardLast4";
ALTER TABLE "CreditCard" RENAME COLUMN "limit" TO "creditLimit";
ALTER TABLE "CreditCard" ADD COLUMN    "installmentPercentage" DECIMAL(5,2);
ALTER TABLE "CreditCard" ADD COLUMN    "outstandingBalanceUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "CreditCard" SET "installmentPercentage"  = 8.33 WHERE "type" = 'installment'; 


