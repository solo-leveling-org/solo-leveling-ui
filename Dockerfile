# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Используем production сборку для CI/CD
# Устанавливаем переменные окружения для production режима
ENV NODE_ENV=production
ENV REACT_APP_ENV=production
ENV REACT_APP_USE_MOCKS=false
# Собираем приложение в production режиме
RUN npm run build:prod

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]