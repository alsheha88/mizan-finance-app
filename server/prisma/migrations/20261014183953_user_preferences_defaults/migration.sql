-- CreateEnum
CREATE TYPE "DateFormat" AS ENUM ('dd_MM_yyyy', 'MM_dd_yyyy', 'yyyy_MM_dd');

UPDATE "User" SET "weekStart" = 'sun' WHERE "weekStart" IS NULL;
UPDATE "User" SET "currency" = 'KWD' WHERE "currency" IS NULL;

-- AlterEnum
BEGIN;
CREATE TYPE "LanguagePreference_new" AS ENUM ('en', 'ar');
ALTER TABLE "User" ALTER COLUMN "language" TYPE "LanguagePreference_new" USING ("language"::text::"LanguagePreference_new");
ALTER TYPE "LanguagePreference" RENAME TO "LanguagePreference_old";
ALTER TYPE "LanguagePreference_new" RENAME TO "LanguagePreference";
DROP TYPE "public"."LanguagePreference_old";
COMMIT;

UPDATE "User" SET "language" = 'en' WHERE "language" IS NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "dateFormat",
ADD COLUMN     "dateFormat" "DateFormat" NOT NULL DEFAULT 'dd_MM_yyyy',
ALTER COLUMN "currency" SET NOT NULL,
ALTER COLUMN "currency" SET DEFAULT 'KWD',
ALTER COLUMN "weekStart" SET NOT NULL,
ALTER COLUMN "weekStart" SET DEFAULT 'sun',
ALTER COLUMN "language" SET NOT NULL,
ALTER COLUMN "language" SET DEFAULT 'en';