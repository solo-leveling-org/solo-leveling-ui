import React from 'react';
import { motion } from 'framer-motion';
import type { CharacterCustomization } from '../tabs/CharacterTab';

interface CustomizationPanelProps {
  customization: CharacterCustomization;
  onUpdate: (updates: Partial<CharacterCustomization>) => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ customization, onUpdate }) => {
  const customizationOptions = {
    skinColor: [
      { value: '#FDBCB4', label: 'Светлый' },
      { value: '#F1C27D', label: 'Средний' },
      { value: '#E0AC69', label: 'Золотистый' },
      { value: '#C68642', label: 'Темный' },
      { value: '#8D5524', label: 'Загорелый' },
      { value: '#654321', label: 'Шоколадный' },
    ],
    hairStyle: [
      { value: 'short', label: 'Короткие', emoji: '✂️' },
      { value: 'long', label: 'Длинные', emoji: '💇‍♀️' },
      { value: 'curly', label: 'Кудрявые', emoji: '🌀' },
    ],
    hairColor: [
      { value: '#8B4513', label: 'Коричневый' },
      { value: '#FFD700', label: 'Блонд' },
      { value: '#000000', label: 'Черный' },
      { value: '#FF4500', label: 'Рыжий' },
      { value: '#9370DB', label: 'Фиолетовый' },
      { value: '#FF69B4', label: 'Розовый' },
    ],
    eyeColor: [
      { value: '#4A90E2', label: 'Голубой' },
      { value: '#228B22', label: 'Зеленый' },
      { value: '#8B4513', label: 'Карий' },
      { value: '#800080', label: 'Фиолетовый' },
      { value: '#FF4500', label: 'Янтарный' },
      { value: '#808080', label: 'Серый' },
    ],
    outfit: [
      { value: 'casual', label: 'Повседневный', emoji: '👕' },
      { value: 'formal', label: 'Деловой', emoji: '🤵' },
      { value: 'sporty', label: 'Спортивный', emoji: '🏃' },
    ],
    accessory: [
      { value: 'none', label: 'Без аксессуаров', emoji: '✨' },
      { value: 'glasses', label: 'Очки', emoji: '👓' },
      { value: 'hat', label: 'Шляпа', emoji: '🎩' },
      { value: 'bow', label: 'Бантик', emoji: '🎀' },
    ],
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const ColorPicker = ({ 
    options, 
    currentValue, 
    onChange 
  }: { 
    options: Array<{value: string, label: string}>, 
    currentValue: string, 
    onChange: (value: string) => void 
  }) => (
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`relative w-8 h-8 rounded-full border-2 transition-all ${
            currentValue === option.value
              ? 'border-white shadow-lg scale-110'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          style={{ backgroundColor: option.value }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={option.label}
        >
          {currentValue === option.value && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-pink-500"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );

  const OptionPicker = ({ 
    options, 
    currentValue, 
    onChange 
  }: { 
    options: Array<{value: string, label: string, emoji?: string}>, 
    currentValue: string, 
    onChange: (value: string) => void 
  }) => (
    <div className="space-y-2">
      {options.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`w-full p-3 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
            currentValue === option.value
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
              : 'bg-white/50 text-gray-700 hover:bg-white/70'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {option.emoji && <span className="text-lg">{option.emoji}</span>}
          <span>{option.label}</span>
        </motion.button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Skin Color */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <span className="text-lg mr-2">🎨</span>
          Цвет кожи
        </h4>
        <ColorPicker
          options={customizationOptions.skinColor}
          currentValue={customization.skinColor}
          onChange={(value) => onUpdate({ skinColor: value })}
        />
      </motion.div>

      {/* Hair Style */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <span className="text-lg mr-2">💇‍♂️</span>
          Прическа
        </h4>
        <OptionPicker
          options={customizationOptions.hairStyle}
          currentValue={customization.hairStyle}
          onChange={(value) => onUpdate({ hairStyle: value })}
        />
      </motion.div>

      {/* Hair Color */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <span className="text-lg mr-2">🌈</span>
          Цвет волос
        </h4>
        <ColorPicker
          options={customizationOptions.hairColor}
          currentValue={customization.hairColor}
          onChange={(value) => onUpdate({ hairColor: value })}
        />
      </motion.div>

      {/* Eye Color */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      >
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <span className="text-lg mr-2">👁️</span>
          Цвет глаз
        </h4>
        <ColorPicker
          options={customizationOptions.eyeColor}
          currentValue={customization.eyeColor}
          onChange={(value) => onUpdate({ eyeColor: value })}
        />
      </motion.div>

      {/* Outfit */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
      >
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <span className="text-lg mr-2">👔</span>
          Одежда
        </h4>
        <OptionPicker
          options={customizationOptions.outfit}
          currentValue={customization.outfit}
          onChange={(value) => onUpdate({ outfit: value })}
        />
      </motion.div>

      {/* Accessory */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
      >
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <span className="text-lg mr-2">✨</span>
          Аксессуары
        </h4>
        <OptionPicker
          options={customizationOptions.accessory}
          currentValue={customization.accessory}
          onChange={(value) => onUpdate({ accessory: value })}
        />
      </motion.div>

      {/* Random button */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.7 }}
        className="pt-4 border-t border-gray-200/30"
      >
        <motion.button
          onClick={() => {
            const randomSkin = customizationOptions.skinColor[Math.floor(Math.random() * customizationOptions.skinColor.length)];
            const randomHair = customizationOptions.hairStyle[Math.floor(Math.random() * customizationOptions.hairStyle.length)];
            const randomHairColor = customizationOptions.hairColor[Math.floor(Math.random() * customizationOptions.hairColor.length)];
            const randomEyes = customizationOptions.eyeColor[Math.floor(Math.random() * customizationOptions.eyeColor.length)];
            const randomOutfit = customizationOptions.outfit[Math.floor(Math.random() * customizationOptions.outfit.length)];
            const randomAccessory = customizationOptions.accessory[Math.floor(Math.random() * customizationOptions.accessory.length)];
            
            onUpdate({
              skinColor: randomSkin.value,
              hairStyle: randomHair.value,
              hairColor: randomHairColor.value,
              eyeColor: randomEyes.value,
              outfit: randomOutfit.value,
              accessory: randomAccessory.value,
            });
          }}
          className="w-full p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-lg">🎲</span>
          <span>Случайный образ</span>
        </motion.button>
      </motion.div>

      {/* Reset button */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.8 }}
      >
        <motion.button
          onClick={() => {
            onUpdate({
              skinColor: '#FDBCB4',
              hairStyle: 'short',
              hairColor: '#8B4513',
              eyeColor: '#4A90E2',
              outfit: 'casual',
              accessory: 'none',
            });
          }}
          className="w-full p-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-all duration-300 flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-lg">🔄</span>
          <span>Сбросить</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CustomizationPanel;
