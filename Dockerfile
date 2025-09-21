# Root-level Dockerfile for backend deployment on Render
# Multi-stage build for production
FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache libc6-compat openssl curl

# Dependency stage
FROM base AS deps
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Generate Prisma client
RUN npx prisma generate

# Build stage
FROM base AS builder
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Install all dependencies (including dev)
RUN npm ci

# Copy backend source code
COPY backend/ ./

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Create data directory for SQLite with proper permissions
RUN mkdir -p /app/data && chown nestjs:nodejs /app/data

# Copy production dependencies
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nestjs:nodejs /app/package*.json ./

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Switch to non-root user
USER nestjs

# Expose port (Render uses PORT env variable)
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:${PORT:-10000}/api/v1/health || exit 1

# Environment variables
ENV NODE_ENV=production
ENV PORT=10000

# Start the application
CMD ["npm", "run", "start:prod"]
