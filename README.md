# Soloist UI

React Telegram Mini App с поддержкой локальной разработки и моков для независимой разработки frontend.

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

tuna http 3000 --subdomain=solo-leveling-ui
```

**Development настройки:**
- API URL: `https://solo-leveling-gateway.ru.tuna.am`
- WebSocket: `wss://solo-leveling-gateway.ru.tuna.am/ws`
- Индикатор: Желтый бейдж "DEVELOPMENT" в правом нижнем углу

### Локальная разработка с моками (без backend)

Для разработки frontend без необходимости запуска backend и Telegram Mini App инфраструктуры:

```bash
npm run start:mocks
```

**Режим моков:**
- Использует моковые данные для всех API запросов
- Имитирует Telegram WebApp API
- Не требует запущенного backend
- Автоматически активируется, если Telegram WebApp недоступен в development режиме
- Все запросы обрабатываются локально с имитацией задержки сети

**Что мокируется:**
- Все API endpoints (Auth, User, Player, Tasks, Topics, Balance)
- Telegram WebApp SDK (initData, user, buttons, alerts, etc.)
- Авторизация и токены
- WebSocket уведомления (отключены в мок режиме)

### Тестирование production режима локально
```bash
# Запуск в production режиме
npm run start:prod
```

**Production настройки:**
- API URL: `https://gateway.solo-leveling.org`
- WebSocket: `wss://gateway.solo-leveling.org/ws`
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

# Использовать моки для локальной разработки (true/false)
# Автоматически активируется, если Telegram WebApp недоступен в development
REACT_APP_USE_MOCKS=true

# API Base URL
REACT_APP_API_BASE_URL=https://solo-leveling-gateway.ru.tuna.am

# WebSocket URL
REACT_APP_WS_URL=wss://solo-leveling-gateway.ru.tuna.am/ws
```

**Автоматическое определение моков:**
В development режиме моки автоматически активируются, если:
- Telegram WebApp недоступен (приложение запущено в обычном браузере)
- Или явно установлена переменная `REACT_APP_USE_MOCKS=true`

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
npm run start:mocks     # Запуск с моками (без backend)
npm run build          # Сборка (по умолчанию production)
npm run build:dev      # Сборка для development
npm run build:prod     # Сборка для production
npm test               # Запуск тестов
npm run generate-api   # Генерация API клиента
```

## Режим моков

### Когда использовать моки

Моки полезны для:
- Разработки UI без зависимости от backend
- Тестирования различных сценариев (пустые списки, ошибки, etc.)
- Демонстрации приложения без инфраструктуры
- Отладки frontend логики

### Структура моков

```
src/mocks/
├── mockData.ts        # Моковые данные для всех endpoints
├── mockApi.ts         # Моковые API сервисы с состоянием
└── mockTelegram.ts    # Мок Telegram WebApp SDK
```

### Моковые данные

Моки включают:
- Пользователь с профилем и балансом
- Список задач (4 задачи разных статусов)
- Топики игрока (активные и неактивные)
- Транзакции баланса
- Авторизация с моковыми токенами

### Изменение моковых данных

Отредактируйте файлы в `src/mocks/` для изменения моковых данных:
- `mockData.ts` - измените данные
- `mockApi.ts` - измените логику обработки запросов

### Отключение моков

Чтобы отключить моки даже в development:
```bash
REACT_APP_USE_MOCKS=false npm start
```

Или в `.env.local`:
```env
REACT_APP_USE_MOCKS=false
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
- **API URL**: `https://gateway.solo-leveling.org`
- **WebSocket**: `wss://gateway.solo-leveling.org/ws`

## Требования

- Node.js 16+
- npm или yarn
- HTTPS dev-gateway на `solo-leveling-gateway.ru.tuna.am`