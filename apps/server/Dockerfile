FROM oven/bun:1 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files - server needs database package
COPY package.json bun.lockb* ./
COPY apps/server/package.json ./apps/server/
COPY packages/database/package.json ./packages/database/
COPY turbo.json ./

# Install dependencies
RUN bun install

# Build the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code - only server and database
COPY apps/server ./apps/server
COPY packages/database ./packages/database
COPY turbo.json ./

# Generate Prisma client (only needed for server)
RUN cd packages/database && bun run db:generate

# Build server
RUN cd apps/server && bun run build

# Production image for server
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 honojs

# Copy built application
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./package.json

# Copy Prisma generated client and database package
COPY --from=builder /app/packages/database/generated ./packages/database/generated
COPY --from=builder /app/packages/database/package.json ./packages/database/package.json

# Copy only required node_modules
COPY --from=builder /app/apps/server/node_modules ./node_modules

USER honojs

EXPOSE 8000

CMD ["bun", "run", "start"]