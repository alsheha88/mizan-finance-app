/*
  Warnings:

  - A unique constraint covering the columns `[creditCardId,transactionDate,amount,description,statementRow]` on the table `CardTransaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `statementRow` to the `CardTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CardTransaction" ADD COLUMN     "statementRow" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CardTransaction_creditCardId_transactionDate_amount_descrip_key" ON "CardTransaction"("creditCardId", "transactionDate", "amount", "description", "statementRow");
