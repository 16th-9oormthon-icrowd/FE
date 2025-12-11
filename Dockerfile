# 멀티스테이지 빌드로 이미지 크기 최적화
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 파일만 먼저 복사 (레이어 캐싱 최적화)
# package.json과 package-lock.json이 변경되지 않으면 이 레이어는 캐시에서 재사용됨
COPY package*.json ./

# 빌드용 ARG (빌드 시 docker build --build-arg 로 전달)
# ARG는 빌드 시점에만 사용되므로 의존성 설치 전에 선언
ARG VITE_API_BASE_URL
ARG VITE_KAKAO_JAVASCRIPT_KEY

# Vite는 빌드 시점에만 ENV를 읽기 때문에 ENV로 전달
ENV VITE_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_KAKAO_JAVASCRIPT_KEY=${VITE_KAKAO_JAVASCRIPT_KEY}

# 모든 의존성 설치 (개발 의존성 포함, 빌드에 필요)
# 소스 코드 변경과 무관하게 의존성만 먼저 설치하여 캐시 효율성 향상
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# 소스 코드 복사 (의존성 설치 후)
# 소스 코드가 변경되어도 의존성이 같으면 위 레이어는 캐시에서 재사용됨
COPY . .

# 빌드 실행
RUN npm run build && \
    npm prune --production && \
    rm -rf node_modules/.cache

# 최종 런타임 이미지 (Nginx 사용으로 메모리 절약)
FROM nginx:alpine

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 정적 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx는 기본적으로 비root 사용자로 실행됨

# 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
