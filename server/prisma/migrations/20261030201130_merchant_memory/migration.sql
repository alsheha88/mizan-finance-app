-- AlterTable
ALTER TABLE "CardTransaction" ADD COLUMN     "merchantKey" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "merchantKey" TEXT;

-- CreateTable
CREATE TABLE "MerchantMemory" (
    "id" UUID NOT NULL,
    "merchantKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,

    CONSTRAINT "MerchantMemory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MerchantMemory_userId_merchantKey_key" ON "MerchantMemory"("userId", "merchantKey");

-- CreateIndex
CREATE INDEX "CardTransaction_userId_merchantKey_idx" ON "CardTransaction"("userId", "merchantKey");

-- CreateIndex
CREATE INDEX "Transaction_userId_merchantKey_idx" ON "Transaction"("userId", "merchantKey");

-- AddForeignKey
ALTER TABLE "MerchantMemory" ADD CONSTRAINT "MerchantMemory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantMemory" ADD CONSTRAINT "MerchantMemory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
