-- CreateEnum
CREATE TYPE "InvestmentCategory" AS ENUM ('stocks', 'ETF', 'crypto', 'funds', 'commodity', 'other');

-- CreateTable
CREATE TABLE "Investment" (
    "id" UUID NOT NULL,
    "asset" TEXT NOT NULL,
    "category" "InvestmentCategory" NOT NULL,
    "shares" DECIMAL(20,8) NOT NULL,
    "purchasePrice" DECIMAL(20,8) NOT NULL,
    "currentPrice" DECIMAL(20,8) NOT NULL,
    "platform" TEXT,
    "symbol" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "priceUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Investment_userId_idx" ON "Investment"("userId");

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
