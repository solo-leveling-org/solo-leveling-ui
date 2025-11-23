import type {
  LoginResponse,
  RefreshResponse,
  GetUserResponse,
  GetActiveTasksResponse,
  GetPlayerTopicsResponse,
  GetPlayerBalanceResponse,
  CompleteTaskResponse,
  SearchPlayerBalanceTransactionsResponse,
  SearchPlayerTasksResponse,
  TgAuthData,
  RefreshRequest,
  SavePlayerTopicsRequest,
  CompleteTaskRequest,
  SkipTaskRequest,
  SearchRequest,
  LocalizedField,
  PlayerTask,
} from '../api';
import {
  mockGetUserResponse,
  mockGetActiveTasksResponse,
  mockGetPlayerBalanceResponse,
  mockLoginResponse,
  mockRefreshResponse,
  mockCompleteTaskResponse,
  mockTasks,
  mockTransactions,
  mockPlayerTopics,
} from './mockData';
import { PlayerTaskStatus, TaskRarity, TaskTopic } from '../api';
import { createMockTask } from './mockData';
import { CancelablePromise } from '../api';

// Имитация задержки сети
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Хранилище состояния для моков (симулирует состояние на сервере)
class MockState {
  private tasks = [...mockTasks];
  private playerTopics = [...mockPlayerTopics];
  private completedTaskIds = new Set<string>();
  private taskIdCounter = 1000; // Счетчик для новых задач
  private preparingTaskTimers = new Map<string, NodeJS.Timeout>(); // Таймеры для задач в статусе PREPARING
  private initialized = false; // Флаг инициализации таймеров

  constructor() {
    // Запускаем таймеры для всех задач в статусе PREPARING при инициализации
    this.initializePreparingTasks();
  }

  private initializePreparingTasks(): void {
    if (this.initialized) return;
    this.initialized = true;
    
    // Запускаем таймеры для всех задач в статусе PREPARING
    this.tasks.forEach(task => {
      if (task.status === PlayerTaskStatus.PREPARING && task.id) {
        this.scheduleTaskStatusChange(task.id);
      }
    });
  }

  getTasks(): GetActiveTasksResponse {
    // Убеждаемся, что таймеры запущены
    this.initializePreparingTasks();
    
    return {
      ...mockGetActiveTasksResponse,
      tasks: this.tasks.filter(t => t.status !== 'COMPLETED' && t.status !== 'SKIPPED'),
    };
  }

  getPlayerTopics(): GetPlayerTopicsResponse {
    return {
      playerTaskTopics: this.playerTopics,
    };
  }

  private generateNewTask(): PlayerTask {
    const taskTitles = [
      'Утренняя зарядка', 'Изучить новый язык', 'Пробежка 3 км', 'Медитация 15 минут',
      'Прочитать статью', 'Написать код', 'Решить задачу по алгоритмам', 'Изучить React',
      'Сделать 50 отжиманий', 'Изучить TypeScript', 'Написать тесты', 'Рефакторинг кода',
      'Йога 30 минут', 'Плавание 1 км', 'Велосипед 10 км', 'Тренировка в зале',
    ];
    const taskDescriptions = [
      'Выполните комплекс утренних упражнений',
      'Потратьте 30 минут на изучение нового языка программирования',
      'Пробегите 3 километра для улучшения физической формы',
      'Проведите 15 минут в медитации для улучшения ментального здоровья',
      'Прочитайте интересную статью по вашей специальности',
      'Напишите новый компонент для проекта',
      'Решите задачу по алгоритмам и структурам данных',
      'Изучите новые возможности React',
    ];
    const rarities = [TaskRarity.COMMON, TaskRarity.UNCOMMON, TaskRarity.RARE, TaskRarity.EPIC, TaskRarity.LEGENDARY];
    const topics = [TaskTopic.PHYSICAL_ACTIVITY, TaskTopic.EDUCATION, TaskTopic.MENTAL_HEALTH, TaskTopic.CREATIVITY];

    const randomIndex = Math.floor(Math.random() * taskTitles.length);
    const taskId = `task-${this.taskIdCounter++}`;
    const maxOrder = Math.max(...this.tasks.map(t => t.order || 0), 0);

    const newTask: PlayerTask = {
      id: taskId,
      version: 1,
      order: maxOrder + 1,
      status: PlayerTaskStatus.PREPARING,
      createdAt: new Date().toISOString(),
      task: createMockTask(
        taskId,
        taskTitles[randomIndex],
        taskDescriptions[randomIndex % taskDescriptions.length],
        rarities[randomIndex % rarities.length],
        [topics[randomIndex % topics.length]],
        80 + (randomIndex % 5) * 20,
        40 + (randomIndex % 5) * 10
      ),
    };
    return newTask;
  }

  private sendTaskNotification(message: string): void {
    // Отправляем notification через window.dispatchEvent для моков
    // Это будет обработано так же, как WebSocket сообщения
    if (typeof window !== 'undefined') {
      const notificationEvent = new CustomEvent('mock-notification', {
        detail: {
          payload: {
            message,
            type: 'INFO' as any,
            source: 'TASKS' as any,
            visible: true,
          },
          timestamp: new Date().toISOString(),
        }
      });
      window.dispatchEvent(notificationEvent);
    }
  }

  private scheduleTaskStatusChange(taskId: string): void {
    // Отменяем предыдущий таймер, если есть
    const existingTimer = this.preparingTaskTimers.get(taskId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Устанавливаем таймер на 3 секунды для перехода в IN_PROGRESS
    const timer = setTimeout(() => {
      const task = this.tasks.find(t => t.id === taskId);
      if (task && task.status === PlayerTaskStatus.PREPARING) {
        task.status = PlayerTaskStatus.IN_PROGRESS;
        this.preparingTaskTimers.delete(taskId);
        
        // Отправляем notification о том, что задача готова
        this.sendTaskNotification(`Новая задача "${task.task?.title || 'Задача'}" готова к выполнению!`);
        
        // Отправляем событие для обновления списка задач
        const event = new CustomEvent('tasks-notification', {
          detail: { source: 'tasks' }
        });
        window.dispatchEvent(event);
      }
    }, 3000);

    this.preparingTaskTimers.set(taskId, timer);
  }

  completeTask(taskId: string): CompleteTaskResponse {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      const task = this.tasks[taskIndex];
      this.completedTaskIds.add(taskId);
      
      // СРАЗУ заменяем старую задачу на новую в статусе PREPARING
      const newTask = this.generateNewTask();
      this.tasks[taskIndex] = newTask;
      
      // Запускаем таймер для перехода в IN_PROGRESS
      if (newTask.id) {
        this.scheduleTaskStatusChange(newTask.id);
      }
      
      // Отправляем событие для обновления списка задач
      const event = new CustomEvent('tasks-notification', {
        detail: { source: 'tasks' }
      });
      window.dispatchEvent(event);
    }
    return mockCompleteTaskResponse;
  }

  skipTask(taskId: string): void {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      // СРАЗУ заменяем старую задачу на новую в статусе PREPARING
      const newTask = this.generateNewTask();
      this.tasks[taskIndex] = newTask;
      
      // Запускаем таймер для перехода в IN_PROGRESS
      if (newTask.id) {
        this.scheduleTaskStatusChange(newTask.id);
      }
      
      // Отправляем событие для обновления списка задач
      const event = new CustomEvent('tasks-notification', {
        detail: { source: 'tasks' }
      });
      window.dispatchEvent(event);
    }
  }

  savePlayerTopics(topics: SavePlayerTopicsRequest): void {
    // Обновляем топики
    if (!topics.playerTaskTopics) {
      return;
    }
    topics.playerTaskTopics.forEach(updatedTopic => {
      const index = this.playerTopics.findIndex(
        pt => pt.taskTopic === updatedTopic.taskTopic
      );
      if (index >= 0) {
        this.playerTopics[index] = { ...this.playerTopics[index], ...updatedTopic };
      } else {
        this.playerTopics.push(updatedTopic);
      }
    });
  }

  generateTasks(): void {
    // Генерируем новые задачи (в реальности это делал бы сервер)
    // Для мока просто возвращаем существующие задачи
  }
}

const mockState = new MockState();

// Моковые API сервисы
export const mockAuthService = {
  login: (requestBody: TgAuthData): CancelablePromise<LoginResponse> => {
    return new CancelablePromise(async (resolve) => {
      await delay(500);
      console.log('[Mock API] Login request:', requestBody);
      resolve(mockLoginResponse);
    });
  },

  refresh: (requestBody: RefreshRequest): CancelablePromise<RefreshResponse> => {
    return new CancelablePromise(async (resolve) => {
      await delay(300);
      console.log('[Mock API] Refresh token request');
      resolve(mockRefreshResponse);
    });
  },
};

export const mockUserService = {
  getCurrentUser: (): CancelablePromise<GetUserResponse> => {
    return new CancelablePromise(async (resolve) => {
      await delay(400);
      console.log('[Mock API] Get current user');
      resolve(mockGetUserResponse);
    });
  },

  getUser: (userId: number): CancelablePromise<GetUserResponse> => {
    return new CancelablePromise(async (resolve) => {
      await delay(400);
      console.log('[Mock API] Get user:', userId);
      resolve(mockGetUserResponse);
    });
  },

  getUserLocale: (): CancelablePromise<any> => {
    return new CancelablePromise(async (resolve) => {
      await delay(200);
      console.log('[Mock API] Get user locale');
      resolve({ locale: 'ru' });
    });
  },

  updateUserLocale: (requestBody: any): CancelablePromise<any> => {
    return new CancelablePromise(async (resolve) => {
      await delay(300);
      console.log('[Mock API] Update user locale:', requestBody);
      resolve({ locale: requestBody.locale || 'ru' });
    });
  },
};

export const mockPlayerService = {
  getCurrentPlayerTopics: (): CancelablePromise<GetPlayerTopicsResponse> => {
    return new CancelablePromise(async (resolve) => {
      await delay(400);
      console.log('[Mock API] Get current player topics');
      resolve(mockState.getPlayerTopics());
    });
  },

  getPlayerTopics: (playerId: number): CancelablePromise<GetPlayerTopicsResponse> => {
    return new CancelablePromise(async (resolve) => {
      await delay(400);
      console.log('[Mock API] Get player topics:', playerId);
      resolve(mockState.getPlayerTopics());
    });
  },

  savePlayerTopics: (requestBody: SavePlayerTopicsRequest): CancelablePromise<void> => {
    return new CancelablePromise(async (resolve) => {
      await delay(500);
      console.log('[Mock API] Save player topics:', requestBody);
      mockState.savePlayerTopics(requestBody);
      resolve(undefined);
    });
  },

  getActiveTasks: (): CancelablePromise<GetActiveTasksResponse> => {
    return new CancelablePromise(async (resolve) => {
      await delay(400);
      console.log('[Mock API] Get active tasks');
      resolve(mockState.getTasks());
    });
  },

  generateTasks: (): CancelablePromise<void> => {
    return new CancelablePromise(async (resolve) => {
      await delay(600);
      console.log('[Mock API] Generate tasks');
      mockState.generateTasks();
      resolve(undefined);
    });
  },

  completeTask: (requestBody: CompleteTaskRequest): CancelablePromise<CompleteTaskResponse> => {
    return new CancelablePromise(async (resolve) => {
      await delay(500);
      const taskId = requestBody.playerTask?.id || '';
      console.log('[Mock API] Complete task:', taskId);
      const response = mockState.completeTask(taskId);
      resolve(response);
    });
  },

  skipTask: (requestBody: SkipTaskRequest): CancelablePromise<void> => {
    return new CancelablePromise(async (resolve) => {
      await delay(400);
      const taskId = requestBody.playerTask?.id || '';
      console.log('[Mock API] Skip task:', taskId);
      mockState.skipTask(taskId);
      resolve(undefined);
    });
  },

  getPlayerBalance: (): CancelablePromise<GetPlayerBalanceResponse> => {
    return new CancelablePromise(async (resolve) => {
      await delay(400);
      console.log('[Mock API] Get player balance');
      resolve(mockGetPlayerBalanceResponse);
    });
  },

  searchPlayerBalanceTransactions: (
    requestBody: SearchRequest,
    page?: number,
    pageSize: number = 20
  ): CancelablePromise<SearchPlayerBalanceTransactionsResponse> => {
    return new CancelablePromise(async (resolve) => {
      await delay(400);
      console.log('[Mock API] Search player balance transactions:', { requestBody, page, pageSize });
      
      let filteredTransactions = [...mockTransactions];
      
      // Применяем фильтры по датам
      if (requestBody.options?.filter?.dateFilters) {
        requestBody.options.filter.dateFilters.forEach(dateFilter => {
          if (dateFilter.field === 'createdAt' && dateFilter.from && dateFilter.to) {
            const fromDate = new Date(dateFilter.from);
            const toDate = new Date(dateFilter.to);
            filteredTransactions = filteredTransactions.filter(transaction => {
              const transactionDate = new Date(transaction.createdAt);
              return transactionDate >= fromDate && transactionDate <= toDate;
            });
          }
        });
      }
      
      // Применяем enum фильтры
      if (requestBody.options?.filter?.enumFilters) {
        requestBody.options.filter.enumFilters.forEach(enumFilter => {
          if (enumFilter.values.length > 0) {
            if (enumFilter.field === 'type') {
              filteredTransactions = filteredTransactions.filter(transaction => 
                enumFilter.values.includes(transaction.type.toString())
              );
            } else if (enumFilter.field === 'cause') {
              filteredTransactions = filteredTransactions.filter(transaction => 
                enumFilter.values.includes(transaction.cause.toString())
              );
            }
          }
        });
      }
      
      // Сортируем по дате создания (новые сначала)
      filteredTransactions.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // Применяем пагинацию
      const currentPage = page || 0;
      const startIndex = currentPage * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
      const hasMore = endIndex < filteredTransactions.length;
      
      // Моковые доступные фильтры
      const mockFilters: LocalizedField[] = [
        {
          field: 'type',
          localization: 'Тип',
          items: [
            { name: 'IN', localization: 'Пополнение' },
            { name: 'OUT', localization: 'Списание' },
          ]
        },
        {
          field: 'cause',
          localization: 'Причина',
          items: [
            { name: 'TASK_COMPLETION', localization: 'Выполнение задачи' },
            { name: 'DAILY_CHECK_IN', localization: 'Ежедневный вход' },
            { name: 'LEVEL_UP', localization: 'Повышение уровня' },
            { name: 'ITEM_PURCHASE', localization: 'Покупка предмета' },
          ]
        }
      ];
      
      const response: SearchPlayerBalanceTransactionsResponse = {
        transactions: paginatedTransactions,
        options: {
          totalRowCount: filteredTransactions.length,
          totalPageCount: Math.ceil(filteredTransactions.length / pageSize),
          currentPage: currentPage,
          hasMore: hasMore,
          filters: mockFilters,
        },
      };
      
      resolve(response);
    });
  },

  searchPlayerTasks: (
    requestBody: SearchRequest,
    page?: number,
    pageSize: number = 20
  ): CancelablePromise<SearchPlayerTasksResponse> => {
    return new CancelablePromise(async (resolve) => {
      await delay(400);
      console.log('[Mock API] Search player tasks:', { requestBody, page, pageSize });
      
      // Фильтруем задачи по статусам из запроса
      let filteredTasks = [...mockTasks];
      
      // Применяем фильтры по датам
      if (requestBody.options?.filter?.dateFilters) {
        requestBody.options.filter.dateFilters.forEach(dateFilter => {
          if (dateFilter.field === 'createdAt' && dateFilter.from && dateFilter.to) {
            const fromDate = new Date(dateFilter.from);
            const toDate = new Date(dateFilter.to);
            filteredTasks = filteredTasks.filter(task => {
              if (!task.createdAt) return false;
              const taskDate = new Date(task.createdAt);
              return taskDate >= fromDate && taskDate <= toDate;
            });
          }
        });
      }
      
      // Применяем enum фильтры
      if (requestBody.options?.filter?.enumFilters) {
        requestBody.options.filter.enumFilters.forEach(enumFilter => {
          if (enumFilter.values.length > 0) {
            if (enumFilter.field === 'status') {
              filteredTasks = filteredTasks.filter(task => 
                task.status && enumFilter.values.includes(task.status.toString())
              );
            } else if (enumFilter.field === 'rarity') {
              // Фильтр по редкости задачи
              filteredTasks = filteredTasks.filter(task => 
                task.task?.rarity && enumFilter.values.includes(task.task.rarity.toString())
              );
            } else if (enumFilter.field === 'topic') {
              // Фильтр по темам задачи
              filteredTasks = filteredTasks.filter(task => {
                if (!task.task?.topics || task.task.topics.length === 0) return false;
                return task.task.topics.some(topic => 
                  enumFilter.values.includes(topic.toString())
                );
              });
            } else {
              // Для других enum фильтров
              filteredTasks = filteredTasks.filter(task => {
                const taskValue = (task as any)[enumFilter.field];
                return taskValue && enumFilter.values.includes(taskValue.toString());
              });
            }
          }
        });
      }
      
      // Не сортируем задачи - оставляем порядок как в исходном массиве
      
      // Применяем пагинацию
      const currentPage = page || 0;
      const startIndex = currentPage * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
      const hasMore = endIndex < filteredTasks.length;
      
      // Логируем статусы задач на первой странице для отладки
      if (currentPage === 0) {
        const statuses = paginatedTasks.map(t => t.status);
        const completedCount = statuses.filter(s => s === 'COMPLETED').length;
        const skippedCount = statuses.filter(s => s === 'SKIPPED').length;
        console.log('[Mock API] First page statuses:', { completed: completedCount, skipped: skippedCount, total: paginatedTasks.length, statuses: statuses.slice(0, 10) });
      }
      
      // Моковые доступные фильтры (можно расширить)
      const mockFilters: LocalizedField[] = [
        {
          field: 'rarity',
          localization: 'Редкость',
          items: [
            { name: 'COMMON', localization: 'Обычная' },
            { name: 'UNCOMMON', localization: 'Необычная' },
            { name: 'RARE', localization: 'Редкая' },
            { name: 'EPIC', localization: 'Эпическая' },
            { name: 'LEGENDARY', localization: 'Легендарная' },
          ]
        },
        {
          field: 'topic',
          localization: 'Тема',
          items: [
            { name: 'PHYSICAL_ACTIVITY', localization: 'Физическая активность' },
            { name: 'EDUCATION', localization: 'Образование' },
            { name: 'MENTAL_HEALTH', localization: 'Ментальное здоровье' },
            { name: 'CREATIVITY', localization: 'Креативность' },
          ]
        }
      ];
      
      const response: SearchPlayerTasksResponse = {
        tasks: paginatedTasks,
        options: {
          totalRowCount: filteredTasks.length,
          totalPageCount: Math.ceil(filteredTasks.length / pageSize),
          currentPage: currentPage,
          hasMore: hasMore,
          filters: mockFilters,
          sorts: ['createdAt', 'updatedAt', 'order']
        },
      };
      
      resolve(response);
    });
  },
};

