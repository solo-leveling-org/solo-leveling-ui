// Task rarity levels
export enum TaskRarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

// 8 different topics for tasks
export enum TaskTopic {
  PHYSICAL_ACTIVITY = 'PHYSICAL_ACTIVITY',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  EDUCATION = 'EDUCATION',
  CREATIVITY = 'CREATIVITY',
  SOCIAL_SKILLS = 'SOCIAL_SKILLS',
  HEALTHY_EATING = 'HEALTHY_EATING',
  PRODUCTIVITY = 'PRODUCTIVITY',
  EXPERIMENTS = 'EXPERIMENTS',
  ECOLOGY = 'ECOLOGY',
  TEAMWORK = 'TEAMWORK',
}

// TaskInfo structure
export interface Task {
  id: string;
  title: string;
  description: string;
  experience: number;
  rarity: TaskRarity;
  topics: TaskTopic[];
  agility: number;
  strength: number;
  intelligence: number;
}

export enum PlayerTaskStatus {
  PREPARING = 0,
  IN_PROGRESS = 1,
  PENDING_COMPLETION = 2,
  COMPLETED = 3,
  SKIPPED = 4,
}

export interface PlayerTask {
  id: string;
  task: Task;
  status: PlayerTaskStatus;
  createdAt: Date;
  closedAt?: Date;
}

export type PlayerTasksResponse = {
  count: number;
  tasks: PlayerTask[];
};

export type UserTopicsResponse = {
  topics: TaskTopic[];
  first_time: boolean;
};

// User profile type
export interface User {
  id: string;
  first_name: string;
  second_name: string;
  username: string;
  photo_url: string;
  completed_tasks: number;
  level: number;
  experience: number;
  experience_to_next_level: number;
  strength: number;
  agility: number;
  intelligence: number;
} 