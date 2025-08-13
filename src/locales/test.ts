import { ru, en } from './index';

// Простой тест для проверки структуры переводов
export const testLocalization = () => {
  console.log('Testing Russian localization...');
  console.log('Welcome title:', ru.welcome.title);
  console.log('Tasks title:', ru.tasks.title);
  console.log('Profile tabs:', ru.profile.tabs);
  
  console.log('\nTesting English localization...');
  console.log('Welcome title:', en.welcome.title);
  console.log('Tasks title:', en.tasks.title);
  console.log('Profile tabs:', en.profile.tabs);
  
  console.log('\nLocalization test completed!');
};

// Проверяем, что все ключи присутствуют в обоих языках
export const validateLocalization = () => {
  const ruKeys = Object.keys(ru);
  const enKeys = Object.keys(en);
  
  const missingInEn = ruKeys.filter(key => !enKeys.includes(key));
  const missingInRu = enKeys.filter(key => !ruKeys.includes(key));
  
  if (missingInEn.length > 0) {
    console.warn('Missing keys in English:', missingInEn);
  }
  
  if (missingInRu.length > 0) {
    console.warn('Missing keys in Russian:', missingInRu);
  }
  
  return {
    ruKeys: ruKeys.length,
    enKeys: enKeys.length,
    missingInEn,
    missingInRu
  };
};
