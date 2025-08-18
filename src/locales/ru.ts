export const ru = {
  // Общие элементы
  common: {
    loading: 'Загрузка...',
    save: 'Сохранить',
    cancel: 'Отмена',
    close: 'Закрыть',
    back: 'Назад',
    next: 'Далее',
    active: 'Активно',
    completed: 'Завершено',
    inProgress: 'В процессе',
    preparing: 'Подготовка',
    pending: 'Ожидает',
    skipped: 'Пропущено',
    error: 'Ошибка',
    success: 'Успешно',
    warning: 'Предупреждение',
    info: 'Информация',
  },

  // Навигация
  navigation: {
    title: 'Навигация',
    profile: 'Профиль',
    tasks: 'Задачи',
    topics: 'Темы',
    welcome: 'Главная',
    telegram: 'Telegram',
  },

  // Приветственная страница
  welcome: {
    title: 'Solo Leveling',
    subtitle: 'Погрузитесь в мир одиночного развития и станьте сильнее с каждым заданием',
    startButton: 'К задачам',
    stats: {
      activePlayers: 'Активных игроков',
      completedTasks: 'Выполнено задач',
      levelsPassed: 'Уровней пройдено',
    },
    features: {
      quickStart: {
        title: 'Быстрый старт',
        description: 'Начните играть мгновенно',
      },
      targetedTasks: {
        title: 'Целевые задания',
        description: 'Развивайтесь по плану',
      },
      progress: {
        title: 'Прогресс',
        description: 'Отслеживайте рост',
      },
      achievements: {
        title: 'Достижения',
        description: 'Получайте награды',
      },
    },
  },

  // Задачи
  tasks: {
    title: 'Твои задачи',
    subtitle: 'Развивайся каждый день с персональными заданиями',
    noTasks: {
      title: 'Выбери свои темы',
      subtitle: 'Это поможет подобрать для тебя лучшие задачи и создать персональный план развития',
      button: 'Перейти к темам',
    },
    status: {
      preparing: 'Подготовка',
      inProgress: 'В процессе',
      pendingCompletion: 'Ожидает завершения',
      completed: 'Завершено',
      skipped: 'Пропущено',
    },
    actions: {
      complete: 'Завершить',
      replace: 'Заменить',
      skip: 'Пропустить',
    },
  },

  // Темы
  topics: {
    title: 'Выбор топиков',
    subtitle: 'Выберите интересующие вас области для получения персональных заданий',
    save: 'Сохранить',
    saving: 'Сохраняю...',
    noChanges: 'Нет изменений для сохранения',
    selectAtLeastOne: 'Выберите хотя бы один топик для продолжения',
    selected: 'Выбрано топиков',
    status: {
      newProfile: 'Новый профиль',
      hasChanges: 'Есть изменения',
      noChanges: 'Без изменений',
      label: 'Статус',
    },
    info: {
      welcome: {
        title: 'Добро пожаловать!',
        description: 'Выберите интересующие вас области для получения персональных заданий. После сохранения система создаст задачи специально для вас!',
      },
      preferences: {
        title: 'Настройка предпочтений',
        description: 'Измените свои предпочтения в любое время. Система адаптирует задания под ваши интересы.',
      },
    },
    labels: {
      PHYSICAL_ACTIVITY: 'Физическая активность',
      MENTAL_HEALTH: 'Ментальное здоровье',
      EDUCATION: 'Образование',
      CREATIVITY: 'Креативность',
      SOCIAL_SKILLS: 'Социальные навыки',
      HEALTHY_EATING: 'Здоровое питание',
      PRODUCTIVITY: 'Продуктивность',
      EXPERIMENTS: 'Эксперименты',
      ECOLOGY: 'Экология',
      TEAMWORK: 'Командная работа',
    },
  },

  // Профиль
  profile: {
    tabs: {
      level: 'Уровень',
      balance: 'Баланс',
      settings: 'Настройки',
    },
    stats: {
      strength: 'Сила',
      agility: 'Ловкость',
      intelligence: 'Интеллект',
      progress: 'Прогресс',
      class: 'Класс',
    },
    balance: {
      recentTransactions: 'Последние транзакции',
      taskCompletion: 'Выполнение задачи',
      itemPurchase: 'Покупка предмета',
      levelBonus: 'Бонус за уровень',
      today: 'Сегодня',
      yesterday: 'Вчера',
      daysAgo: 'дня назад',
    },
    settings: {
      language: {
        title: 'Язык',
        description: 'Выберите язык интерфейса',
        russian: 'Русский',
        english: 'English',
        sourceTitle: 'Источник языка',
        useTelegram: 'Telegram',
        chooseManually: 'Вручную',
        sourceDescription: 'Язык из Telegram или вручную.',
        manualDisabledHint: 'Ручной выбор недоступен, включен режим Telegram',
      },
    },
  },

  // Диалоги и модальные окна
  dialogs: {
    task: {
      close: 'Закрыть',
      rewardsTitle: 'Награды',
      experience: 'Опыт',
      coins: 'Монеты',
      statsTitle: 'Характеристики',
      categoriesTitle: 'Категории',
    },
  },

  // Ошибки и сообщения
  errors: {
    telegramRequired: 'Требуется Telegram',
    authError: 'Ошибка авторизации',
    loadingError: 'Ошибка загрузки',
    saveError: 'Ошибка сохранения',
  },
  // Редкости задач
  rarity: {
    COMMON: 'Обычная',
    UNCOMMON: 'Необычная',
    RARE: 'Редкая',
    EPIC: 'Эпическая',
    LEGENDARY: 'Легендарная',
  },
};
