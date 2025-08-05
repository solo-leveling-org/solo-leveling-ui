import { UserService } from './api/services/UserService';
import { PlayerService } from './api/services/PlayerService';
import type { User as ApiUser } from './api/models/User';
import type { PlayerTask as ApiPlayerTask } from './api/models/PlayerTask';
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
  
  generateTasks: async (selectedTopics: ApiTaskTopic[]): Promise<ApiPlayerTask[]> => {
    try {
      // Сначала сохраняем топики
      await PlayerService.savePlayerTopics({
        topics: selectedTopics
      });
      
      // Затем генерируем задачи
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
  completeTask: async (id: string): Promise<ApiPlayerTask[]> => {
    try {
      // Получаем текущие задачи
      const currentTasks: GetActiveTasksResponse = await PlayerService.getActiveTasks();
      const targetTask = currentTasks.tasks.find(t => t.id === id);
      
      if (!targetTask) {
        throw new Error('Task not found');
      }
      
      // Выполняем задачу
      await PlayerService.completeTask({
        playerTask: targetTask
      });
      
      // Получаем обновленный список задач
      const updatedResponse: GetActiveTasksResponse = await PlayerService.getActiveTasks();
      return updatedResponse.tasks;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },
  
  replaceTask: async (id: string, selectedTopics: ApiTaskTopic[]): Promise<ApiPlayerTask[]> => {
    try {
      // Получаем текущие задачи
      const currentTasks: GetActiveTasksResponse = await PlayerService.getActiveTasks();
      const targetTask = currentTasks.tasks.find(t => t.id === id);
      
      if (!targetTask) {
        throw new Error('Task not found');
      }
      
      // Пропускаем задачу
      await PlayerService.skipTask({
        playerTask: targetTask
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