import { Task, TaskRarity, TaskTopic, User, PlayerTask, PlayerTaskStatus } from './types';

// Mock user
const mockUser: User = {
  id: '1',
  first_name: 'John',
  second_name: 'Doe',
  username: 'johndoe',
  photo_url: 'https://randomuser.me/api/portraits/men/1.jpg',
  completed_tasks: 42,
  level: 5,
  experience: 1200,
  experience_to_next_level: 1500,
  strength: 18,
  agility: 15,
  intelligence: 20,
};

function getRandomTopics(selectedTopics: TaskTopic[]): TaskTopic[] {
  if (selectedTopics.length === 0) return [Object.values(TaskTopic)[0]];
  const shuffled = [...selectedTopics].sort(() => Math.random() - 0.5);
  const count = Math.random() > 0.5 && selectedTopics.length > 1 ? 2 : 1;
  return shuffled.slice(0, count);
}

function generateRandomTask(id: string, selectedTopics: TaskTopic[]): Task {
  const rarities = [
    TaskRarity.COMMON,
    TaskRarity.UNCOMMON,
    TaskRarity.RARE,
    TaskRarity.EPIC,
    TaskRarity.LEGENDARY,
  ];
  const titles = [
    'Short title',
    'A bit longer task title for testing',
    'This is a very long task title to check how the dialog handles overflow and wrapping',
    'Medium task',
    'Another task with a reasonably long name',
  ];
  const descriptions = [
    'Short description.',
    'This is a medium length description for the task.',
    'A very long description that is meant to test how the dialog handles large amounts of text. It should wrap correctly and not break the layout, even if the text is much longer than usual.',
    'Another short desc.',
    'A description that is a bit longer than the others, but not too long.',
  ];
  const topicsForTask = getRandomTopics(selectedTopics);
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  const idx = Math.floor(Math.random() * titles.length);
  return {
    id,
    title: titles[idx],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    experience: Math.floor(Math.random() * 100) + 10,
    rarity,
    agility: Math.floor(Math.random() * 10),
    strength: Math.floor(Math.random() * 10),
    intelligence: Math.floor(Math.random() * 10),
    topics: topicsForTask,
  };
}

function generateMockPlayerTasks(selectedTopics: TaskTopic[]): PlayerTask[] {
  const now = new Date();
  const count = 6;
  return Array.from({ length: count }).map((_, i) => ({
    id: `task-${i + 1}`,
    status: PlayerTaskStatus.IN_PROGRESS,
    createdAt: now,
    closedAt: undefined,
    task: generateRandomTask(`task-${i + 1}`, selectedTopics),
  }));
}

// Mock tasks (empty by default)
let userTasks: PlayerTask[] = [];

// Временное хранилище для топиков пользователя
let userSelectedTopics: TaskTopic[] = [];
let firstTimeFlag: boolean = true;

export const api = {
  getUser: async (): Promise<User> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockUser), 1200)); // задержка 1.2 сек
  },
  generateTasks: async (selectedTopics: TaskTopic[]): Promise<PlayerTask[]> => {
    userTasks = generateMockPlayerTasks(selectedTopics);
    return new Promise((resolve) => setTimeout(() => resolve(userTasks), 2000));
  },
  getPlayerTasks: async (): Promise<{ count: number; tasks: PlayerTask[] }> => {
    return new Promise((resolve) => setTimeout(() => resolve({ count: userTasks.length, tasks: [...userTasks] }), 1000));
  },
  getUserTopics: async (): Promise<{ topics: TaskTopic[]; first_time: boolean }> => {
    return new Promise((resolve) => setTimeout(() => resolve({ topics: [...userSelectedTopics], first_time: firstTimeFlag }), 500));
  },
  saveUserTopics: async (topics: TaskTopic[]): Promise<void> => {
    userSelectedTopics = [...topics];
    firstTimeFlag = false;
    return new Promise((resolve) => setTimeout(resolve, 300));
  },
};

export const taskActions = {
  completeTask: async (id: string): Promise<PlayerTask[]> => {
    userTasks = userTasks.map((pt) =>
      pt.id === id && pt.status === PlayerTaskStatus.IN_PROGRESS
        ? { ...pt, status: PlayerTaskStatus.PENDING_COMPLETION }
        : pt
    );
    // Здесь можно сделать реальный PATCH/POST на backend
    return Promise.resolve([...userTasks]);
  },
  replaceTask: async (id: string, selectedTopics: TaskTopic[]): Promise<PlayerTask[]> => {
    // Сначала ставим PREPARING
    userTasks = userTasks.map((pt) =>
      pt.id === id && pt.status === PlayerTaskStatus.IN_PROGRESS
        ? { ...pt, status: PlayerTaskStatus.PREPARING }
        : pt
    );
    // Имитация задержки backend (5 сек)
    await new Promise((resolve) => setTimeout(resolve, 5000));
    // Заменяем на новую задачу IN_PROGRESS
    userTasks = userTasks.map((pt) =>
      pt.id === id
        ? {
            ...pt,
            status: PlayerTaskStatus.IN_PROGRESS,
            task: generateRandomTask(pt.id, selectedTopics),
            createdAt: new Date(),
            closedAt: undefined,
          }
        : pt
    );
    // Здесь можно сделать реальный PATCH/POST на backend
    return Promise.resolve([...userTasks]);
  },
}; 