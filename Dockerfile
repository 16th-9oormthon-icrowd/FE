FROM node:20-alpine

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

# 비root 사용자 생성 및 권한 설정
RUN addgroup -g 1001 -S nodejs && \
    adduser -S viteuser -u 1001 && \
    chown -R viteuser:nodejs /app

USER viteuser

# Expose port (Vite preview 기본 포트는 4173이지만 3000 사용)
EXPOSE 3000

# Vite preview 서버 실행
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"]
