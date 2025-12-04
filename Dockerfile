FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# --- Vite 빌드용 ARG (빌드 시 docker build --build-arg 로 전달해야 함) ---
ARG VITE_BASE_URL
ARG VITE_KAKAO_JAVASCRIPT_KEY

# Vite는 빌드 시점에만 ENV를 읽기 때문에 ENV로 전달
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_KAKAO_JAVASCRIPT_KEY=$VITE_KAKAO_JAVASCRIPT_KEY

# Build the Vite app
RUN npm run build


# 비root 사용자 생성 및 권한 설정
RUN addgroup -g 1001 -S nodejs && \
    adduser -S viteuser -u 1001 && \
    chown -R viteuser:nodejs /app

USER viteuser

# Expose port (Vite preview 기본 포트는 4173이지만 3000 사용)
EXPOSE 3000

# Vite preview 서버 실행
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"]
