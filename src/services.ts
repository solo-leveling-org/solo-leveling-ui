import type {
  CompleteTaskResponse,
  GetActiveTasksResponse,
  GetPlayerTopicsResponse,
  GetUserResponse,
  PlayerTaskTopic,
  GetPlayerBalanceResponse,
  SearchRequest,
  SearchPlayerBalanceTransactionsResponse,
  SearchPlayerTasksResponse
} from './api';
import {PlayerService, PlayerTask, UserService} from './api';
import type {User as ApiUser} from './api/models/User';
import type {PlayerTask as ApiPlayerTask} from './api/models/PlayerTask';

export const api = {
  getUser: async (): Promise<ApiUser> => {
    try {
      const response: GetUserResponse = await UserService.getCurrentUser();
      return response.user;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  getUserById: async (userId: number): Promise<ApiUser> => {
    try {
      const response: GetUserResponse = await UserService.getUser(userId);
      return response.user;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  },

  generateTasks: async (): Promise<ApiPlayerTask[]> => {
    try {
      await PlayerService.generateTasks();

      // Получаем активные задачи
      const response: GetActiveTasksResponse = await PlayerService.getActiveTasks();
      return response.tasks;
    } catch (error) {
      console.error('Error generating tasks:', error);
      throw error;
    }
  },

  getPlayerTasks: async (): Promise<GetActiveTasksResponse> => {
    try {
      return await PlayerService.getActiveTasks();
    } catch (error) {
      console.error('Error getting player tasks:', error);
      throw error;
    }
  },

  getUserTopics: async (): Promise<GetPlayerTopicsResponse> => {
    try {
      return await PlayerService.getPlayerTopics();
    } catch (error) {
      console.error('Error getting user topics:', error);
      // Возвращаем пустой список топиков при ошибке
      return {
        playerTaskTopics: []
      };
    }
  },

  saveUserTopics: async (topics: PlayerTaskTopic[]): Promise<void> => {
    try {
      await PlayerService.savePlayerTopics({
        playerTaskTopics: topics
      });
    } catch (error) {
      console.error('Error saving user topics:', error);
      throw error;
    }
  },

  getPlayerBalance: async (): Promise<GetPlayerBalanceResponse> => {
    try {
      return await PlayerService.getPlayerBalance();
    } catch (error) {
      console.error('Error getting player balance:', error);
      throw error;
    }
  },

  searchPlayerBalanceTransactions: async (
    request: SearchRequest,
    page?: number,
    pageSize: number = 20
  ): Promise<SearchPlayerBalanceTransactionsResponse> => {
    try {
      return await PlayerService.searchPlayerBalanceTransactions(request, page, pageSize);
    } catch (error) {
      console.error('Error searching player balance transactions:', error);
      throw error;
    }
  },

  searchPlayerTasks: async (
    request: SearchRequest,
    page?: number,
    pageSize: number = 20
  ): Promise<SearchPlayerTasksResponse> => {
    try {
      return await PlayerService.searchPlayerTasks(request, page, pageSize);
    } catch (error) {
      console.error('Error searching player tasks:', error);
      throw error;
    }
  },

  getUsersLeaderboard: async (
    type: import('./api').LeaderboardType,
    request: import('./api').GetUsersLeaderboardRequest,
    page?: number,
    pageSize: number = 20
  ): Promise<import('./api').GetUsersLeaderboardResponse> => {
    try {
      return await UserService.getUsersLeaderboard(type, request, page, pageSize);
    } catch (error) {
      console.error('Error getting users leaderboard:', error);
      throw error;
    }
  },
};

export const taskActions = {
  completeTask: async (playerTask: PlayerTask): Promise<CompleteTaskResponse> => {
    try {
      if (!playerTask.id) {
        throw new Error('Task ID is required');
      }
      // WebSocket уведомления автоматически обновят список задач
      return await PlayerService.completeTask(playerTask.id);
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },

  skipTask: async (playerTask: PlayerTask): Promise<void> => {
    try {
      if (!playerTask.id) {
        throw new Error('Task ID is required');
      }
      await PlayerService.skipTask(playerTask.id);

      // WebSocket уведомления автоматически обновят список задач
    } catch (error) {
      console.error('Error skipping task:', error);
      throw error;
    }
  },
}; 