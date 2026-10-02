/*
  Warnings:

  - Added the required column `statementRow` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Transaction_accountId_transactionDate_idx";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "statementRow" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Transaction_accountId_transactionDate_statementRow_idx" ON "Transaction"("accountId", "transactionDate", "statementRow");
