# ChurrasApp API Dockerfile - Development Environment
# Otimizado para hot-reload e desenvolvimento local

FROM node:18.20-alpine3.20

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for nodemon)
RUN npm install

# Create app user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Create necessary directories
RUN mkdir -p /app/src /app/tests
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Copy source code (will be overridden by volume in development)
COPY --chown=nodejs:nodejs src/ ./src/
COPY --chown=nodejs:nodejs tests/ ./tests/

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application with nodemon for hot-reload
CMD ["npm", "run", "dev"]