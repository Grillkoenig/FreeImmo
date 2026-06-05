-- AlterTable: add moderation flag; DEFAULT true so existing listings stay visible
ALTER TABLE "Inserat" ADD COLUMN "geprueft" BOOLEAN NOT NULL DEFAULT true;
