FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY libs/ ./libs/

RUN npm i

COPY . .

RUN npx prisma generate --schema ./apps/subscription/prisma/schema.prisma
RUN npm run build subscription

FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/libs/proto ./libs/proto
COPY --from=builder /app/apps/subscription/prisma ./prisma
RUN npm i --only=production

EXPOSE 5052

CMD [ "node", "dist/apps/subscription/main.js"]