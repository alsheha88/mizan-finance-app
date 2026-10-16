-- DropIndex
DROP INDEX "Transaction_transferGroupId_idx";

-- CreateIndex
CREATE INDEX "Transaction_userId_transferGroupId_idx" ON "Transaction"("userId", "transferGroupId");
