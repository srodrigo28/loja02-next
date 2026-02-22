# syntax=docker/dockerfile:1.6

# ==========================================
# STAGE 1: DEPENDENCIAS
# ==========================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json ./
COPY package-lock.json* yarn.lock* pnpm-lock.yaml* ./

RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
    else echo "Nenhum lockfile encontrado (package-lock.json, yarn.lock, pnpm-lock.yaml)." && exit 1; \
    fi

# ==========================================
# STAGE 2: BUILD
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN if [ -f package-lock.json ]; then npm run build; \
    elif [ -f yarn.lock ]; then corepack enable && yarn build; \
    else corepack enable && pnpm build; \
    fi

# Garante que a pasta public nao quebre o COPY final quando estiver ausente.
RUN mkdir -p /app/.next/standalone/public && \
    if [ -d /app/public ]; then cp -R /app/public/. /app/.next/standalone/public/; fi

# ==========================================
# STAGE 3: RUNNER
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir -p .next && chown -R nextjs:nodejs .next

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
