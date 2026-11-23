-- AlterTable
ALTER TABLE "CardTransaction" ADD COLUMN     "recurringPaymentId" UUID;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "recurringPaymentId" UUID;

-- CreateTable
CREATE TABLE "RecurringPayment" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "expectedAmount" DECIMAL(12,3) NOT NULL,
    "matchKey" TEXT NOT NULL,
    "expectedDay" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "amountVaries" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "categoryId" UUID,

    CONSTRAINT "RecurringPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecurringPayment_userId_name_key" ON "RecurringPayment"("userId", "name");

-- CreateIndex
CREATE INDEX "CardTransaction_recurringPaymentId_idx" ON "CardTransaction"("recurringPaymentId");

-- CreateIndex
CREATE INDEX "Transaction_recurringPaymentId_idx" ON "Transaction"("recurringPaymentId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recurringPaymentId_fkey" FOREIGN KEY ("recurringPaymentId") REFERENCES "RecurringPayment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardTransaction" ADD CONSTRAINT "CardTransaction_recurringPaymentId_fkey" FOREIGN KEY ("recurringPaymentId") REFERENCES "RecurringPayment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringPayment" ADD CONSTRAINT "RecurringPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringPayment" ADD CONSTRAINT "RecurringPayment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
