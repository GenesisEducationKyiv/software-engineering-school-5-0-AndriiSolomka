FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY libs/ ./libs/

RUN npm i

COPY . .

RUN npm run build gateway

FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/libs/proto ./libs/proto

RUN npm i --only=production

EXPOSE 5055

CMD ["node", "dist/apps/gateway/main.js"]