# Build stage
FROM node:20-alpine AS builder
WORKDIR /kidzone_api

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code (includes src/model with schema)
COPY . .

# Generate Prisma client (specify schema location)
RUN npx prisma generate

# Build TypeScript
RUN yarn build

# Production stage
FROM node:20-alpine AS production
WORKDIR /kidzone_api

# Copy dependency files
COPY package.json yarn.lock ./

# Set npm registry and install production dependencies with extended timeout
RUN yarn config set registry https://registry.npmjs.org && \
    yarn install --frozen-lockfile --production --network-timeout 300000 && \
    yarn cache clean

# Install ONLY production dependencies
RUN yarn install --frozen-lockfile --production && \
    yarn cache clean

# Copy built application
COPY --from=builder /kidzone_api/dist ./dist

# Copy generated Prisma client from builder
COPY --from=builder /kidzone_api/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /kidzone_api/node_modules/@prisma/client ./node_modules/@prisma/client

# Create non-root user BEFORE creating directories
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Create logs directory with proper permissions
RUN mkdir -p logs && \
    chown -R nodejs:nodejs /kidzone_api/logs

# Switch to non-root user
USER nodejs

EXPOSE 3001
CMD ["node", "./dist/index.js"]