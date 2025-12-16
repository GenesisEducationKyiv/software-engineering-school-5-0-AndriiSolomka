FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build the weather-utils library first
RUN cd packages/weather-utils && npm ci && npm run build

RUN npm run build notification

FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/libs/proto ./libs/proto

RUN npm ci --only=production

EXPOSE 5053

CMD ["node", "dist/apps/notification/main.js"]