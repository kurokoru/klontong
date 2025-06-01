FROM oven/bun:1 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files - only what web app needs
COPY package.json bun.lockb* ./
COPY apps/web/package.json ./apps/web/
COPY turbo.json ./

# Install dependencies
RUN bun install

# Build the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

# Copy only web app source code
COPY apps/web ./apps/web
COPY turbo.json ./

# Build only web app
RUN cd apps/web && bun run build

# Production image for web app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 reactjs

# Copy built application
COPY --from=builder /app/apps/web/build ./build
COPY --from=builder /app/apps/web/package.json ./package.json

# Copy only required node_modules for production
COPY --from=builder /app/apps/web/node_modules ./node_modules

USER reactjs

EXPOSE 3000

CMD ["bun", "run", "start"]