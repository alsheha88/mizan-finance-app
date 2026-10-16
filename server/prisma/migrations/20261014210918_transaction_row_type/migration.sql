-- CreateEnum
CREATE TYPE "RowType" AS ENUM ('debit_card_purchase', 'pos_purchase', 'credit_card_payment', 'own_transfer', 'person_transfer', 'salary', 'loan_installment', 'standing_order', 'bank_fee', 'incoming_wire', 'card_refund', 'unknown');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "rowType" "RowType" NOT NULL DEFAULT 'unknown';
