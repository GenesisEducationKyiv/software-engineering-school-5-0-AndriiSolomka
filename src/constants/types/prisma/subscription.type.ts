import { Prisma } from '@prisma/client';

export type SubWithTokens = Prisma.SubscriptionGetPayload<{
  include: { tokens: true };
}>;
