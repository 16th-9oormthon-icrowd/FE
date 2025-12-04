# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Define and pass build-time environment variables
ARG VITE_BASE_URL
ARG VITE_KAKAO_JAVASCRIPT_KEY
ENV VITE_BASE_URL=${VITE_BASE_URL}
ENV VITE_KAKAO_JAVASCRIPT_KEY=${VITE_KAKAO_JAVASCRIPT_KEY}

# Build the application
RUN npm run build

# Verify build output exists
RUN test -d dist && test -f dist/index.html || (echo "Build failed: dist directory or index.html not found" && exit 1)

# Production stage
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration from build context
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Explicitly set entrypoint and command for nginx
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
