export const ru = {
  // Общие элементы
  common: {
    loading: 'Загрузка...',
    save: 'Сохранить',
    cancel: 'Отмена',
    close: 'Закрыть',
    back: 'Назад',
    next: 'Далее',
    confirm: 'Подтвердить',
    active: 'Активно',
    completed: 'Завершено',
    inProgress: 'В процессе',
    preparing: 'Подготовка',
    pending: 'Ожидает',
    skipped: 'Пропущено',
    success: 'Успешно',
    warning: 'Предупреждение',
    info: 'Информация',
    retry: 'Повторить',
    error: {
      loadingData: 'Ошибка загрузки данных',
    },
    filters: 'Фильтры',
    clearFilters: 'Очистить фильтры',
    resetFilters: 'Сбросить фильтры',
    sortBy: 'Сортировать по',
    noSort: 'Без сортировки',
    ascending: 'По возрастанию',
    descending: 'По убыванию',
    dateRange: 'Диапазон дат',
    loadingData: 'Ошибка загрузки данных',
    noData: 'Данные отсутствуют',
    showFilters: 'Показать фильтры',
    hideFilters: 'Скрыть фильтры',
    from: 'С',
    to: 'По',
    selectDateRange: 'Выберите диапазон дат',
    apply: 'Применить',
    clear: 'Очистить',
    sortFields: {
      createdAt: 'Дата создания',
      amount: 'Сумма'
    },
    today: 'Сегодня',
    yesterday: 'Вчера',
    months: {
      january: 'Январь',
      february: 'Февраль',
      march: 'Март',
      april: 'Апрель',
      may: 'Май',
      june: 'Июнь',
      july: 'Июль',
      august: 'Август',
      september: 'Сентябрь',
      october: 'Октябрь',
      november: 'Ноябрь',
      december: 'Декабрь'
    },
    monthsGenitive: {
      january: 'января',
      february: 'февраля',
      march: 'марта',
      april: 'апреля',
      may: 'мая',
      june: 'июня',
      july: 'июля',
      august: 'августа',
      september: 'сентября',
      october: 'октября',
      november: 'ноября',
      december: 'декабря'
    },
    days: {
      monday: 'Понедельник',
      tuesday: 'Вторник',
      wednesday: 'Среда',
      thursday: 'Четверг',
      friday: 'Пятница',
      saturday: 'Суббота',
      sunday: 'Воскресенье'
    },
  },

  // Навигация
  navigation: {
    title: 'Навигация',
    profile: 'Профиль',
    balance: 'Баланс',
    tasks: 'Задачи',
    topics: 'Темы',
    welcome: 'Главная',
    games: 'Коллекции',
  },

  // Приветственная страница
  welcome: {
    title: 'Solo Leveling',
    subtitle: 'Погрузитесь в мир одиночного развития и становитесь сильнее с каждым заданием',
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
    },
    buttons: {
      complete: 'Готово',
      replace: 'Заменить',
    },
    confirm: {
      complete: 'Вы уверены, что хотите завершить эту задачу?',
      replace: 'Вы уверены, что хотите заменить эту задачу?',
    },
    viewMode: {
      active: 'Активные',
      completed: 'Завершенные',
    },
    noCompletedTasks: 'Нет завершенных задач',
    noCompletedTasksDescription: 'Выполняйте задачи, чтобы увидеть их здесь!',
    filters: {
      reset: 'Сбросить фильтры',
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
      CREATIVITY: 'Креативность',
      SOCIAL_SKILLS: 'Социальные навыки',
      NUTRITION: 'Питание',
      PRODUCTIVITY: 'Продуктивность',
      ADVENTURE: 'Приключения',
      MUSIC: 'Музыка',
      BRAIN: 'Когнитивные навыки',
      CYBERSPORT: 'Киберспорт',
      DEVELOPMENT: 'Разработка',
      READING: 'Чтение',
      LANGUAGE_LEARNING: 'Изучение языков',
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
      title: 'Настройки',
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

  // Баланс
  balance: {
    title: 'Баланс',
    subtitle: 'Ваш текущий баланс и история транзакций',
    totalBalance: 'Общий баланс',
    currencyName: 'Solo Leveling Coin',
    topUp: 'Пополнить',
    transfer: 'Перевести',
    transactions: {
      title: 'История транзакций',
      empty: 'Транзакции не найдены',
      emptyDescription: 'Выполняйте задачи, чтобы заработать награды!'
    },
    empty: 'Пока нет транзакций',
    causes: {
      TASK_COMPLETION: 'Выполнение задачи',
      LEVEL_UP: 'Бонус за повышение уровня',
      DAILY_CHECK_IN: 'Ежедневная отметка',
      ITEM_PURCHASE: 'Покупка предмета',
    },
        filters: {
          period: 'Период',
          reset: 'Сбросить',
          selectPeriod: 'Выберите период',
          selected: 'выбрано',
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
      createdAt: 'Создана',
      completedAt: 'Завершена',
      skippedAt: 'Пропущена',
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

  // Карточки задач
  taskCard: {
    complete: 'Готово',
    replace: 'Заменить',
    completed: 'Завершено',
    skipped: 'Пропущено',
    generating: 'Генерируется...',
  },

  // Диалог завершения задачи
  taskCompletion: {
    title: 'Задача выполнена!',
    level: 'Уровень',
    experience: 'Опыт',
    topicsProgress: 'Прогресс по темам',
    stats: 'Характеристики',
    balance: 'Баланс',
    balanceGained: 'за выполнение задачи',
    continue: 'Продолжить',
  },

  // Коллекции
  collections: {
    tabs: {
      leaderboard: 'ТАБЛИЦА ЛИДЕРОВ',
      lootboxes: 'ЛУТ БОКСЫ',
      inventory: 'ИНВЕНТАРЬ',
    },
    leaderboard: {
      title: 'Таблица лидеров',
      subtitle: 'Соревнуйся с другими игроками и поднимайся в рейтинге',
    },
    types: {
      level: 'По уровню',
      tasks: 'По задачам',
      balance: 'По балансу',
    },
    score: {
      level: 'Уровень',
      tasks: 'Выполнено задач',
      balance: 'Баланс',
    },
    lootboxes: {
      comingSoon: 'Скоро',
      description: 'Лут боксы будут доступны в ближайшее время',
    },
    inventory: {
      comingSoon: 'Скоро',
      description: 'Инвентарь будет доступен в ближайшее время',
    },
  },
};
