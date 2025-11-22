import type {
  User,
  PlayerTask,
  Task,
  GetUserResponse,
  GetActiveTasksResponse,
  GetPlayerTopicsResponse,
  GetPlayerBalanceResponse,
  PlayerTaskTopic,
  CompleteTaskResponse,
  LoginResponse,
  RefreshResponse,
  SearchPlayerBalanceTransactionsResponse,
  SearchPlayerTasksResponse,
  PlayerBalanceTransaction,
  Level,
  JwtToken,
} from '../api';
import {
  TaskTopic,
  TaskRarity,
  Assessment,
  PlayerTaskStatus,
  PlayerBalanceTransactionType,
  PlayerBalanceTransactionCause,
  JwtTokenType,
} from '../api';

// Моковые данные для пользователя
export const mockUser: User = {
  id: 1,
  version: 1,
  username: 'mock_user',
  firstName: 'Mock',
  lastName: 'User',
  photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MockUser&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  locale: 'ru',
  roles: [],
  player: {
    id: 1,
    version: 1,
    maxTasks: 5,
    agility: 10,
    strength: 15,
    intelligence: 12,
    level: {
      id: 'level-1',
      version: 1,
      level: 5,
      totalExperience: 2500,
      currentExperience: 500,
      experienceToNextLevel: 1000,
      assessment: Assessment.B,
    },
    balance: {
      id: 'balance-1',
      version: 1,
      balance: {
        currencyCode: 'GOLD',
        amount: 1500,
      },
    },
    taskTopics: [],
  },
};

// Моковые уровни для топиков
const createMockLevel = (level: number, assessment: Assessment): Level => ({
  id: `level-${level}`,
  version: 1,
  level,
  totalExperience: level * 500,
  currentExperience: (level * 500) % 1000,
  experienceToNextLevel: 1000,
  assessment,
});

// Моковые топики игрока
export const mockPlayerTopics: PlayerTaskTopic[] = [
  {
    id: 'topic-1',
    version: 1,
    isActive: true,
    taskTopic: TaskTopic.PHYSICAL_ACTIVITY,
    level: createMockLevel(3, Assessment.B),
  },
  {
    id: 'topic-2',
    version: 1,
    isActive: true,
    taskTopic: TaskTopic.EDUCATION,
    level: createMockLevel(5, Assessment.A),
  },
  {
    id: 'topic-3',
    version: 1,
    isActive: false,
    taskTopic: TaskTopic.CREATIVITY,
    level: createMockLevel(1, Assessment.E),
  },
  {
    id: 'topic-4',
    version: 1,
    isActive: true,
    taskTopic: TaskTopic.MENTAL_HEALTH,
    level: createMockLevel(2, Assessment.C),
  },
];

// Моковые задачи
const createMockTask = (
  id: string,
  title: string,
  description: string,
  rarity: TaskRarity,
  topics: TaskTopic[],
  experience: number,
  currencyReward: number
): Task => ({
  id,
  version: 1,
  title,
  description,
  experience,
  currencyReward,
  rarity,
  topics,
  agility: 5,
  strength: 5,
  intelligence: 5,
});

export const mockTasks: PlayerTask[] = [
  {
    id: 'task-1',
    version: 1,
    order: 1,
    status: PlayerTaskStatus.PREPARING,
    task: createMockTask(
      'task-1',
      'Пробежка 5 км',
      'Пробегите 5 километров для улучшения физической формы',
      TaskRarity.COMMON,
      [TaskTopic.PHYSICAL_ACTIVITY],
      100,
      50
    ),
  },
  {
    id: 'task-2',
    version: 1,
    order: 2,
    status: PlayerTaskStatus.IN_PROGRESS,
    task: createMockTask(
      'task-2',
      'Прочитать главу книги',
      'Прочитайте одну главу из книги по программированию',
      TaskRarity.UNCOMMON,
      [TaskTopic.EDUCATION],
      150,
      75
    ),
  },
  {
    id: 'task-3',
    version: 1,
    order: 3,
            status: PlayerTaskStatus.IN_PROGRESS,
    task: createMockTask(
      'task-3',
      'Медитация 10 минут',
      'Проведите 10 минут в медитации для улучшения ментального здоровья',
      TaskRarity.COMMON,
      [TaskTopic.MENTAL_HEALTH],
      80,
      40
    ),
  },
  {
    id: 'task-4',
    version: 1,
    order: 4,
    status: PlayerTaskStatus.IN_PROGRESS,
    task: createMockTask(
      'task-4',
      'Написать код',
      'Напишите новый компонент для проекта',
      TaskRarity.RARE,
      [TaskTopic.CREATIVITY, TaskTopic.EDUCATION],
      200,
      100
    ),
  },
  {
    id: 'task-5',
    version: 1,
    order: 5,
    status: PlayerTaskStatus.COMPLETED,
    task: createMockTask(
      'task-5',
      'Утренняя зарядка',
      'Выполните комплекс утренних упражнений',
      TaskRarity.COMMON,
      [TaskTopic.PHYSICAL_ACTIVITY],
      80,
      40
    ),
  },
  {
    id: 'task-6',
    version: 1,
    order: 6,
    status: PlayerTaskStatus.COMPLETED,
    task: createMockTask(
      'task-6',
      'Изучить новый язык',
      'Потратьте 30 минут на изучение нового языка программирования',
      TaskRarity.UNCOMMON,
      [TaskTopic.EDUCATION],
      120,
      60
    ),
  },
];

// Моковые транзакции баланса
const createMockTransaction = (
  id: string,
  amount: number,
  type: PlayerBalanceTransactionType,
  cause: PlayerBalanceTransactionCause,
  daysAgo: number
): PlayerBalanceTransaction => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return {
    id,
    version: 1,
    amount: {
      currencyCode: 'GOLD',
      amount,
    },
    type,
    cause,
    createdAt: date.toISOString(),
  };
};

export const mockTransactions: PlayerBalanceTransaction[] = [
  createMockTransaction('trans-1', 100, PlayerBalanceTransactionType.IN, PlayerBalanceTransactionCause.TASK_COMPLETION, 0),
  createMockTransaction('trans-2', 50, PlayerBalanceTransactionType.IN, PlayerBalanceTransactionCause.DAILY_CHECK_IN, 1),
  createMockTransaction('trans-3', 200, PlayerBalanceTransactionType.IN, PlayerBalanceTransactionCause.LEVEL_UP, 2),
  createMockTransaction('trans-4', 75, PlayerBalanceTransactionType.IN, PlayerBalanceTransactionCause.TASK_COMPLETION, 3),
  createMockTransaction('trans-5', 150, PlayerBalanceTransactionType.OUT, PlayerBalanceTransactionCause.ITEM_PURCHASE, 4),
  createMockTransaction('trans-6', 120, PlayerBalanceTransactionType.IN, PlayerBalanceTransactionCause.TASK_COMPLETION, 5),
];

// Моковые токены
const createMockJwtToken = (type: JwtTokenType): JwtToken => {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 24);
  return {
    token: `mock_${type}_token_${Date.now()}`,
    expiration: expiration.toISOString(),
    type,
  };
};

// API Responses
export const mockGetUserResponse: GetUserResponse = {
  user: mockUser,
};

export const mockGetActiveTasksResponse: GetActiveTasksResponse = {
  tasks: mockTasks,
  firstTime: false,
};

export const mockGetPlayerTopicsResponse: GetPlayerTopicsResponse = {
  playerTaskTopics: mockPlayerTopics,
};

export const mockGetPlayerBalanceResponse: GetPlayerBalanceResponse = {
  balance: mockUser.player.balance!,
};

export const mockLoginResponse: LoginResponse = {
  accessToken: createMockJwtToken(JwtTokenType.ACCESS),
  refreshToken: createMockJwtToken(JwtTokenType.REFRESH),
};

export const mockRefreshResponse: RefreshResponse = {
  accessToken: createMockJwtToken(JwtTokenType.ACCESS),
};

export const mockCompleteTaskResponse: CompleteTaskResponse = {
  playerBefore: {
    ...mockUser.player,
    level: {
      ...mockUser.player.level!,
      currentExperience: mockUser.player.level!.currentExperience,
    },
  },
  playerAfter: {
    ...mockUser.player,
    level: {
      ...mockUser.player.level!,
      currentExperience: mockUser.player.level!.currentExperience + 100,
      totalExperience: mockUser.player.level!.totalExperience + 100,
    },
    balance: {
      ...mockUser.player.balance!,
      balance: {
        currencyCode: 'GOLD',
        amount: mockUser.player.balance!.balance.amount + 50,
      },
    },
  },
};

export const mockSearchPlayerTasksResponse: SearchPlayerTasksResponse = {
  tasks: mockTasks.filter(t => t.status === PlayerTaskStatus.COMPLETED || t.status === PlayerTaskStatus.SKIPPED),
  options: {
    totalRowCount: 2,
    totalPageCount: 1,
    currentPage: 0,
    hasMore: false,
  },
};

export const mockSearchPlayerBalanceTransactionsResponse: SearchPlayerBalanceTransactionsResponse = {
  transactions: mockTransactions,
  options: {
    totalRowCount: mockTransactions.length,
    totalPageCount: 1,
    currentPage: 0,
    hasMore: false,
  },
};

// Моковые данные для Telegram WebApp
export const mockTelegramUser = {
  id: 123456789,
  first_name: 'Mock',
  last_name: 'User',
  username: 'mock_user',
  language_code: 'ru',
  is_premium: false,
  photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MockUser&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
};

export const mockTelegramWebAppData = {
  user: mockTelegramUser,
  auth_date: Math.floor(Date.now() / 1000),
  hash: 'mock_hash_string',
  query_id: 'mock_query_id',
  start_param: '',
};

