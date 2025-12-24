# =============================================================================
# Musical Instrument Classifier - Frontend Dockerfile
# Multi-stage build with nginx for production
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Builder - Build the React application
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build argument for API URL (can be overridden at build time)
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN pnpm build

# -----------------------------------------------------------------------------
# Stage 2: Runtime - Serve with nginx
# -----------------------------------------------------------------------------
FROM nginx:alpine AS runtime

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
