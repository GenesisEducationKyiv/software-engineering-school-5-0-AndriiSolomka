-- DropForeignKey
ALTER TABLE "token" DROP CONSTRAINT "token_subscription_id_fkey";

-- AlterTable
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_pkey",
DROP COLUMN "subscription_id",
ADD COLUMN     "subscriptionId" SERIAL NOT NULL,
ADD CONSTRAINT "subscription_pkey" PRIMARY KEY ("subscriptionId");

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("subscriptionId") ON DELETE CASCADE ON UPDATE CASCADE;
