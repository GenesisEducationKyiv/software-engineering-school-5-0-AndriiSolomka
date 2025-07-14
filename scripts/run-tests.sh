#!/bin/sh

npm ci

npx prisma generate --schema ./apps/subscription/prisma/schema.prisma
npx prisma migrate deploy --schema ./apps/subscription/prisma/schema.prisma
npm run test:integration