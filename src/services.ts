import { UserService } from './api/services/UserService';
import { PlayerService } from './api/services/PlayerService';
import type { User as ApiUser } from './api/models/User';
import type { PlayerTask as ApiPlayerTask, PlayerTask } from './api/models/PlayerTask';
import type { TaskTopic as ApiTaskTopic } from './api/models/TaskTopic';
import type { GetActiveTasksResponse } from './api/models/GetActiveTasksResponse';
import type { GetPlayerTopicsResponse } from './api/models/GetPlayerTopicsResponse';
import type { GetUserResponse } from './api/models/GetUserResponse';

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
      const response: GetActiveTasksResponse = await PlayerService.getActiveTasks();
      return response;
    } catch (error) {
      console.error('Error getting player tasks:', error);
      throw error;
    }
  },
  
  getUserTopics: async (): Promise<GetPlayerTopicsResponse> => {
    try {
      const response: GetPlayerTopicsResponse = await PlayerService.getCurrentPlayerTopics();
      return response;
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
  completeTask: async (ptask: PlayerTask): Promise<ApiPlayerTask[]> => {
    try {
      if (!ptask) {
        throw new Error('Task not found');
      }
      
      // Выполняем задачу
      await PlayerService.completeTask({
        playerTask: ptask
      });
      
      // Получаем обновленный список задач
      const updatedResponse: GetActiveTasksResponse = await PlayerService.getActiveTasks();
      return updatedResponse.tasks;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },
  
  replaceTask: async (ptask: PlayerTask): Promise<ApiPlayerTask[]> => {
    try {
      if (!ptask) {
        throw new Error('Task not found');
      }
      
      // Пропускаем задачу
      await PlayerService.skipTask({
        playerTask: ptask
      });
      
      // Получаем обновленный список задач
      const updatedResponse: GetActiveTasksResponse = await PlayerService.getActiveTasks();
      return updatedResponse.tasks;
    } catch (error) {
      console.error('Error replacing task:', error);
      throw error;
    }
  },
}; 