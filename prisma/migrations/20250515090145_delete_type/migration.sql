/*
  Warnings:

  - You are about to drop the column `type` on the `token` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "token" DROP COLUMN "type";

-- DropEnum
DROP TYPE "TokenType";
