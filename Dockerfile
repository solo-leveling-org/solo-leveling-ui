# Build stage
FROM node:18-alpine AS build

# Создаём пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Копируем package файлы отдельно для кэширования
COPY --chown=nextjs:nodejs package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Копируем исходники
COPY --chown=nextjs:nodejs . .

# Собираем приложение
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Копируем статические файлы
COPY --from=build /app/build /usr/share/nginx/html

# Копируем конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Безопасность: запуск от непривилегированного пользователя
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Открываем порт
EXPOSE 80

# Запуск nginx
USER nginx
CMD ["nginx", "-g", "daemon off;"]