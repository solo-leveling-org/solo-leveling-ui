/**
 * Утилита для получения месяца в родительном падеже (для русского языка)
 * Используется для форматирования дат вида "1 декабря"
 */
export const getMonthGenitive = (
  monthIndex: number,
  t: (key: string) => string,
  locale: string = 'ru'
): string => {
  if (locale !== 'ru') {
    // Для других языков используем обычную форму
    const monthKeys = [
      'common.months.january',
      'common.months.february',
      'common.months.march',
      'common.months.april',
      'common.months.may',
      'common.months.june',
      'common.months.july',
      'common.months.august',
      'common.months.september',
      'common.months.october',
      'common.months.november',
      'common.months.december'
    ];
    return t(monthKeys[monthIndex]);
  }

  // Для русского языка используем родительный падеж
  const monthKeysGenitive = [
    'common.monthsGenitive.january',
    'common.monthsGenitive.february',
    'common.monthsGenitive.march',
    'common.monthsGenitive.april',
    'common.monthsGenitive.may',
    'common.monthsGenitive.june',
    'common.monthsGenitive.july',
    'common.monthsGenitive.august',
    'common.monthsGenitive.september',
    'common.monthsGenitive.october',
    'common.monthsGenitive.november',
    'common.monthsGenitive.december'
  ];
  
  return t(monthKeysGenitive[monthIndex]);
};

