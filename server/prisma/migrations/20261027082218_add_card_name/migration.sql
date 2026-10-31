/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `CreditCard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `CreditCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_userId_name_key" ON "CreditCard"("userId", "name");
