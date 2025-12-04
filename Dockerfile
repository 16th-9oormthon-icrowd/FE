# --------------------------
# Build Stage
# --------------------------
FROM node:20-alpine AS builder
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


# --------------------------
# Production (Nginx)
# --------------------------
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
