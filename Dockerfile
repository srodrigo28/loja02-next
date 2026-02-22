# ==========================================
# ESTÁGIO 1: DEPENDÊNCIAS (Base)
# ==========================================
FROM node:20-alpine AS deps
# Adiciona biblioteca C necessária para pacotes nativos em imagens Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copia os gerenciadores de pacote. 
# Se usar yarn ou pnpm, altere aqui. Assumindo NPM pelo seu padrão.
COPY package.json package-lock.json* ./
RUN npm ci

# ==========================================
# ESTÁGIO 2: BUILDER (Compilação)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilita telemetria do Next.js para economizar processamento
ENV NEXT_TELEMETRY_DISABLED=1

# Roda o processo de build do Next.js
RUN npm run build

# ==========================================
# ESTÁGIO 3: RUNNER (Produção Final)
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criação de um usuário sem privilégios root (Regra de Segurança!)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia a pasta pública
COPY --from=builder /app/public ./public

# Configura permissão para o cache do Next.js
RUN mkdir .next
RUN chown nextjs:nodejs .next

# A MÁGICA ACONTECE AQUI: 
# Copia apenas o núcleo "Standalone" gerado no Passo 1 e os estáticos
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Muda para o usuário seguro
USER nextjs

# Expõe a porta que o container vai falar com o Nginx
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# O Next.js 'standalone' gera um server.js puro, não precisamos de npm start!
CMD ["node", "server.js"]
