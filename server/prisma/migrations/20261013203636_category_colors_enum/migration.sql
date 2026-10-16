/*
  Warnings:

  - Changed the type of `color` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaletteColor" AS ENUM ('mint', 'cyan', 'sky', 'indigo', 'violet', 'pink', 'rose', 'orange', 'coral', 'amber', 'yellow', 'mauve');

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "color",
ADD COLUMN     "color" "PaletteColor" NOT NULL;
