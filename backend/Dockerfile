# --- Stage 1: Build ---
FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g npm@11.6.2

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


# --- Stage 2: Runner ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g npm@11.6.2

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/sql ./dist/src/sql

EXPOSE 3010

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]