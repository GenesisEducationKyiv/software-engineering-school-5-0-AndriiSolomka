/*
  Warnings:

  - The primary key for the `subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `token` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "token" DROP CONSTRAINT "token_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "subscription_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "subscription_id_seq";

-- AlterTable
ALTER TABLE "token" DROP CONSTRAINT "token_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "subscriptionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "token_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "token_id_seq";

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
