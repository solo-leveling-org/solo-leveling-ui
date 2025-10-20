# Solo Leveling UI

React Telegram Mini App с поддержкой локальной разработки.

## Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Локальная разработка (Development)
```bash
# Запуск в development режиме (по умолчанию)
npm start
# или явно
npm run start:dev
```

**Development настройки:**
- API URL: `https://solo-leveling-gateway.ru.tuna.am`
- WebSocket: `wss://solo-leveling-gateway.ru.tuna.am/ws`
- Индикатор: Желтый бейдж "DEVELOPMENT" в правом нижнем углу

### Тестирование production режима локально
```bash
# Запуск в production режиме
npm run start:prod
```

**Production настройки:**
- API URL: `https://gateway.solo-leveling.online`
- WebSocket: `wss://gateway.solo-leveling.online/ws`
- Индикатор: Зеленый бейдж "PRODUCTION" в правом нижнем углу

## Профили окружения

Проект поддерживает два профиля:

### Development (по умолчанию)
- Используется для локальной разработки
- Подключается к локальному backend на `localhost:10002`
- Показывает индикатор окружения

### Production
- Используется для продакшена
- Подключается к production backend
- Индикатор окружения скрыт

## Переменные окружения

Создайте файл `.env.local` в корне проекта для переопределения настроек:

```env
# Environment: development or production
REACT_APP_ENV=development

# API Base URL
REACT_APP_API_BASE_URL=https://solo-leveling-gateway.ru.tuna.am

# WebSocket URL
REACT_APP_WS_URL=wss://solo-leveling-gateway.ru.tuna.am/ws
```

## Сборка

### Development сборка
```bash
npm run build:dev
```

### Production сборка
```bash
npm run build:prod
```

## Структура конфигурации

```
src/config/environment.ts - Основная конфигурация
├── developmentConfig - Настройки для разработки
├── productionConfig - Настройки для продакшена
└── config - Текущая активная конфигурация
```

## Проверка конфигурации

В консоли браузера можно проверить текущую конфигурацию:

```javascript
import { config } from './src/config/environment';
console.log('Current config:', config);
```

## Автоматическое определение окружения

Система автоматически определяет окружение в следующем порядке:
1. Переменная `REACT_APP_ENV`
2. Переменная `NODE_ENV` (production = production, остальное = development)
3. По умолчанию: development

## Доступные команды

```bash
npm start              # Запуск в development режиме
npm run start:dev      # Запуск в development режиме (явно)
npm run start:prod     # Запуск в production режиме
npm run build          # Сборка (по умолчанию production)
npm run build:dev      # Сборка для development
npm run build:prod     # Сборка для production
npm test               # Запуск тестов
npm run generate-api   # Генерация API клиента
```

## Настройка dev-gateway

Development режим использует HTTPS dev-gateway:

- **API**: `https://solo-leveling-gateway.ru.tuna.am`
- **WebSocket**: `wss://solo-leveling-gateway.ru.tuna.am/ws`

Это позволяет тестировать приложение как локально, так и в Telegram WebApp без CORS проблем.

## CI/CD и Production

### Docker сборка
```bash
# Сборка production образа
docker build -t solo-leveling-ui:latest .
```

### Kubernetes деплой
```bash
# Применение манифестов
kubectl apply -f k8s/
```

### Production настройки в Docker
- **NODE_ENV**: `production`
- **REACT_APP_ENV**: `production`
- **API URL**: `https://gateway.solo-leveling.online`
- **WebSocket**: `wss://gateway.solo-leveling.online/ws`

## Требования

- Node.js 16+
- npm или yarn
- HTTPS dev-gateway на `solo-leveling-gateway.ru.tuna.am`