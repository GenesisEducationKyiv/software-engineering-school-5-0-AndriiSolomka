-- DropForeignKey
ALTER TABLE "token" DROP CONSTRAINT "token_subscription_id_fkey";

-- AlterTable
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "subscriptionId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "subscription_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "token" DROP CONSTRAINT "token_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "subscription_id",
DROP COLUMN "token_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "subscriptionId" INTEGER NOT NULL,
ADD CONSTRAINT "token_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
