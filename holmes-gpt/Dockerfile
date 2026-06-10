# Multi-stage build for HolmesGPT
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Note: ANTHROPIC_API_KEY should be provided at runtime via -e flag

# Build the application
RUN npm run build

# Keep production dependencies only for the runtime image
RUN npm prune --omit=dev

# Clean up unnecessary files to reduce image size
RUN rm -rf /app/node_modules/.cache

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 svelte

# Copy the built application
COPY --from=builder /app/.svelte-kit/output ./svelte-kit/output
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy the quotes data
COPY --from=builder /app/downloads/training_data ./downloads/training_data

# Create data directory and set permissions for volume mounts
RUN mkdir -p /app/data && chown -R svelte:nodejs /app
# Ensure the svelte user can write to the data directory
RUN chmod 755 /app/data

# Create a non-root user
USER svelte

# Volume for persistent database storage
VOLUME ["/app/data"]

EXPOSE 3000

# Start the application using SvelteKit's built-in server
CMD ["node", "build"] 