import { Task, TaskRarity, TaskTopic, User, PlayerTask, PlayerTaskStatus } from './types';

// Mock topics
const topics: TaskTopic[] = [
  TaskTopic.PHYSICAL_ACTIVITY,
  TaskTopic.MENTAL_HEALTH,
  TaskTopic.EDUCATION,
  TaskTopic.SOCIAL,
  TaskTopic.CREATIVITY,
  TaskTopic.FINANCE,
  TaskTopic.CAREER,
  TaskTopic.MINDFULNESS,
];

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
  const topicCount = selectedTopics.length > 1 ? (Math.random() > 0.5 ? 2 : 1) : 1;
  const shuffled = [...selectedTopics].sort(() => Math.random() - 0.5);
  const taskTopics = shuffled.slice(0, topicCount);
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  const idx = Math.floor(Math.random() * titles.length);
  return {
    id,
    title: titles[idx],
    description: descriptions[idx],
    experience: Math.floor(Math.random() * 100) + 10,
    rarity,
    agility: Math.floor(Math.random() * 10),
    strength: Math.floor(Math.random() * 10),
    intelligence: Math.floor(Math.random() * 10),
    topics: taskTopics.length ? taskTopics : [TaskTopic.EDUCATION],
  };
}

// Helper to generate random tasks with various title/description lengths
function generateMockPlayerTasks(selectedTopics: TaskTopic[]): PlayerTask[] {
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
  const now = new Date();
  return [
    // PREPARING
    {
      id: 'prep-1',
      status: PlayerTaskStatus.PREPARING,
      createdAt: now,
      closedAt: undefined,
      task: undefined as any,
    },
    // IN_PROGRESS
    {
      id: 'inprog-1',
      status: PlayerTaskStatus.IN_PROGRESS,
      createdAt: now,
      closedAt: undefined,
      task: {
        id: '1',
        title: titles[0],
        description: descriptions[0],
        experience: 63,
        rarity: rarities[1],
        topics: [TaskTopic.EDUCATION],
        agility: 5,
        strength: 6,
        intelligence: 0,
      },
    },
    // PENDING_COMPLETION
    {
      id: 'pend-1',
      status: PlayerTaskStatus.PENDING_COMPLETION,
      createdAt: now,
      closedAt: undefined,
      task: {
        id: '2',
        title: titles[1],
        description: descriptions[1],
        experience: 41,
        rarity: rarities[2],
        topics: [TaskTopic.EDUCATION],
        agility: 8,
        strength: 7,
        intelligence: 2,
      },
    },
    // COMPLETED (не будет отображаться в основном списке)
    {
      id: 'comp-1',
      status: PlayerTaskStatus.COMPLETED,
      createdAt: now,
      closedAt: now,
      task: {
        id: '3',
        title: titles[2],
        description: descriptions[2],
        experience: 22,
        rarity: rarities[3],
        topics: [TaskTopic.EDUCATION],
        agility: 0,
        strength: 3,
        intelligence: 6,
      },
    },
    // SKIPPED (не будет отображаться в основном списке)
    {
      id: 'skip-1',
      status: PlayerTaskStatus.SKIPPED,
      createdAt: now,
      closedAt: now,
      task: {
        id: '4',
        title: titles[3],
        description: descriptions[3],
        experience: 33,
        rarity: rarities[4],
        topics: [TaskTopic.EDUCATION],
        agility: 8,
        strength: 4,
        intelligence: 2,
      },
    },
    // IN_PROGRESS (ещё одна)
    {
      id: 'inprog-2',
      status: PlayerTaskStatus.IN_PROGRESS,
      createdAt: now,
      closedAt: undefined,
      task: {
        id: '5',
        title: titles[4],
        description: descriptions[4],
        experience: 55,
        rarity: rarities[0],
        topics: [TaskTopic.EDUCATION],
        agility: 2,
        strength: 1,
        intelligence: 9,
      },
    },
  ];
}

// Mock tasks (empty by default)
let userTasks: PlayerTask[] = [];

// Временное хранилище для топиков пользователя
let userSelectedTopics: TaskTopic[] = [];
let firstTimeFlag: boolean = true;

export const api = {
  getTopics: async (): Promise<TaskTopic[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(topics), 300));
  },
  getUser: async (): Promise<User> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockUser), 1200)); // задержка 1.2 сек
  },
  getTasks: async (): Promise<PlayerTask[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(userTasks), 300));
  },
  generateTasks: async (selectedTopics: TaskTopic[]): Promise<PlayerTask[]> => {
    userTasks = generateMockPlayerTasks(selectedTopics);
    return new Promise((resolve) => setTimeout(() => resolve(userTasks), 2000));
  },
  resetTasks: async (): Promise<void> => {
    userTasks = [];
    return new Promise((resolve) => setTimeout(() => resolve(), 200));
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