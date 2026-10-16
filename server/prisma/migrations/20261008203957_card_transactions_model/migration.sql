-- CreateEnum
CREATE TYPE "CardTransactionType" AS ENUM ('payment', 'purchase');

-- CreateTable
CREATE TABLE "CardTransaction" (
    "id" UUID NOT NULL,
    "merchant" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,3) NOT NULL,
    "transactionDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "cardTransactionType" "CardTransactionType" NOT NULL,
    "creditCardId" UUID NOT NULL,
    "categoryId" UUID,
    "userId" UUID NOT NULL,

    CONSTRAINT "CardTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CardTransaction" ADD CONSTRAINT "CardTransaction_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardTransaction" ADD CONSTRAINT "CardTransaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardTransaction" ADD CONSTRAINT "CardTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
