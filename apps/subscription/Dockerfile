FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build the weather-utils library first
RUN cd packages/weather-utils && npm ci && npm run build

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
RUN npm ci --only=production

EXPOSE 5052

CMD [ "node", "dist/apps/subscription/main.js"]