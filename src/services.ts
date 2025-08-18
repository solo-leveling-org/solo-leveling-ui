import {PlayerTask, UserService} from './api';
import {PlayerService} from './api';
import type {User as ApiUser} from './api/models/User';
import type {PlayerTask as ApiPlayerTask} from './api/models/PlayerTask';
import type {TaskTopic as ApiTaskTopic} from './api/models/TaskTopic';
import type {GetActiveTasksResponse} from './api';
import type {GetPlayerTopicsResponse} from './api';
import type {GetUserResponse} from './api';
import type {CompleteTaskResponse} from './api';

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
      return await PlayerService.getCurrentPlayerTopics();
    } catch (error) {
      console.error('Error getting user topics:', error);
      // Возвращаем пустой список топиков при ошибке
      return {
        playerTaskTopics: []
      };
    }
  },

  saveUserTopics: async (topics: ApiTaskTopic[]): Promise<void> => {
    try {
      await PlayerService.savePlayerTopics({
        topics: topics
      });
    } catch (error) {
      console.error('Error saving user topics:', error);
      throw error;
    }
  },
};

export const taskActions = {
  completeTask: async (playerTask: PlayerTask): Promise<{ tasks: ApiPlayerTask[], completionResponse: CompleteTaskResponse }> => {
    try {
      const completionResponse = await PlayerService.completeTask({
        playerTask: playerTask
      });

      const updatedResponse: GetActiveTasksResponse = await PlayerService.getActiveTasks();
      return {
        tasks: updatedResponse.tasks,
        completionResponse: completionResponse
      };
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },

  skipTask: async (playerTask: PlayerTask): Promise<ApiPlayerTask[]> => {
    try {
      await PlayerService.skipTask({
        playerTask: playerTask
      });

      const updatedResponse: GetActiveTasksResponse = await PlayerService.getActiveTasks();
      return updatedResponse.tasks;
    } catch (error) {
      console.error('Error skipping task:', error);
      throw error;
    }
  },
}; 