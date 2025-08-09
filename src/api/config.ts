import { OpenAPI } from './core/OpenAPI';
import { auth } from '../auth';

// Подключаем функцию getTokenForRequest к OpenAPI клиенту
OpenAPI.TOKEN = auth.getTokenForRequest;

export { OpenAPI };
