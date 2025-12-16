# Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# Build frontend
COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm ci
COPY client . 
RUN npm run build

# Build backend
WORKDIR /app
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --production

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy built frontend
COPY --from=builder /app/client/dist ./public

# Copy server
COPY --from=builder /app/server . 

EXPOSE 3000 5432

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["npm", "start"]
