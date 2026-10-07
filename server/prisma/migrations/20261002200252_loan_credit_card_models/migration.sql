-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('installment', 'fullDeduction');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "creditCardId" UUID,
ADD COLUMN     "loanId" UUID;

-- CreateTable
CREATE TABLE "Loan" (
    "id" UUID NOT NULL,
    "installment" DECIMAL(12,3) NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "originalAmount" DECIMAL(12,3) NOT NULL,
    "startDate" DATE NOT NULL,
    "lastInstallmentDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditCard" (
    "id" UUID NOT NULL,
    "limit" DECIMAL(12,3) NOT NULL,
    "type" "CardType" NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "outstandingBalance" DECIMAL(12,3) NOT NULL,
    "expiryDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Loan_userId_invoiceNumber_key" ON "Loan"("userId", "invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_userId_cardNumber_key" ON "CreditCard"("userId", "cardNumber");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "CreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
