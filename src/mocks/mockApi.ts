import type {
  LoginResponse,
  RefreshResponse,
  GetUserResponse,
  GetActiveTasksResponse,
  GetPlayerTopicsResponse,
  GetPlayerBalanceResponse,
  CompleteTaskResponse,
  SearchPlayerBalanceTransactionsResponse,
  TgAuthData,
  RefreshRequest,
  SavePlayerTopicsRequest,
  CompleteTaskRequest,
  SkipTaskRequest,
  SearchRequest,
} from '../api';
import {
  mockGetUserResponse,
  mockGetActiveTasksResponse,
  mockGetPlayerBalanceResponse,
  mockLoginResponse,
  mockRefreshResponse,
  mockCompleteTaskResponse,
  mockSearchPlayerBalanceTransactionsResponse,
  mockTasks,
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
      resolve(mockSearchPlayerBalanceTransactionsResponse);
    });
  },
};

