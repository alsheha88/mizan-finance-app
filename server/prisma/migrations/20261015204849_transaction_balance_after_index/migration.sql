/*
  Warnings:

  - A unique constraint covering the columns `[accountId,transactionDate,amount,balanceAfter]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transaction_accountId_transactionDate_amount_balanceAfter_key" ON "Transaction"("accountId", "transactionDate", "amount", "balanceAfter");
