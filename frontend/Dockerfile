FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json* ./
COPY yarn.lock* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]