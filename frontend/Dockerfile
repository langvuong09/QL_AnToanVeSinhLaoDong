# --- Stage 1: Build ---
FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

# Cài đặt dependency dựa trên package-lock.json
COPY package*.json ./
RUN npm install

# Copy source code và build
COPY . .

ARG NEXT_PUBLIC_API_ENDPOINT
ENV NEXT_PUBLIC_API_ENDPOINT=$NEXT_PUBLIC_API_ENDPOINT

RUN npm run build

# --- Stage 2: Runner ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set permissions cho thư mục cache của Next.js
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy output từ quá trình build standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
