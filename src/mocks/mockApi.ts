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
  PlayerTask,
  LocalizedField,
} from '../api';
import {
  mockGetUserResponse,
  mockGetActiveTasksResponse,
  mockGetPlayerBalanceResponse,
  mockLoginResponse,
  mockRefreshResponse,
  mockCompleteTaskResponse,
  mockSearchPlayerBalanceTransactionsResponse,
  mockSearchPlayerTasksResponse,
  mockTasks,
  mockTransactions,
  mockPlayerTopics,
} from './mockData';
import { CancelablePromise } from '../api/core/CancelablePromise';

// Имитация задержки сети
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Хранилище состояния для моков (симулирует состояние на сервере)
class MockState {
  private tasks = [...mockTasks];
  private playerTopics = [...mockPlayerTopics];
  private completedTaskIds = new Set<string>();

  getTasks(): GetActiveTasksResponse {
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

  completeTask(taskId: string): CompleteTaskResponse {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'COMPLETED' as any;
      this.completedTaskIds.add(taskId);
    }
    return mockCompleteTaskResponse;
  }

  skipTask(taskId: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'SKIPPED' as any;
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
      
      // Сортируем по дате создания (новые сначала), если есть createdAt
      filteredTasks.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Новые сначала
      });
      
      // Применяем пагинацию
      const currentPage = page || 0;
      const startIndex = currentPage * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
      const hasMore = endIndex < filteredTasks.length;
      
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

