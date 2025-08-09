import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCharacter from '../components/AnimatedCharacter';
import CustomizationPanel from '../components/CustomizationPanel';

type CharacterTabProps = {
  isAuthenticated: boolean;
};

export interface CharacterCustomization {
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  outfit: string;
  accessory: string;
  mood: 'idle' | 'happy' | 'excited' | 'focused' | 'tired';
}

const defaultCustomization: CharacterCustomization = {
  skinColor: '#FDBCB4',
  hairStyle: 'short',
  hairColor: '#8B4513',
  eyeColor: '#4A90E2',
  outfit: 'casual',
  accessory: 'none',
  mood: 'idle'
};

const CharacterTab: React.FC<CharacterTabProps> = ({ isAuthenticated }) => {
  const [customization, setCustomization] = useState<CharacterCustomization>(defaultCustomization);
  const [showCustomization, setShowCustomization] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем сохраненную кастомизацию из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('character-customization');
    if (saved) {
      try {
        setCustomization(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading character customization:', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Сохраняем изменения в localStorage
  const updateCustomization = (updates: Partial<CharacterCustomization>) => {
    const newCustomization = { ...customization, ...updates };
    setCustomization(newCustomization);
    localStorage.setItem('character-customization', JSON.stringify(newCustomization));
  };

  // Автоматические изменения настроения на основе действий
  const triggerMoodChange = (mood: CharacterCustomization['mood']) => {
    updateCustomization({ mood });
    // Возвращаем к idle через 3 секунды
    setTimeout(() => {
      updateCustomization({ mood: 'idle' });
    }, 3000);
  };

  if (isLoading) {
    return <CharacterSkeleton />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-pink-50/30 to-purple-50/20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400/8 to-purple-400/8 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-gradient-to-tr from-blue-400/8 to-cyan-400/8 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 rounded-full blur-2xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 shadow-2xl backdrop-blur-sm border"
            style={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(147, 51, 234, 0.15))',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <span className="text-3xl">🎭</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 tracking-tight">
            Твой персонаж
          </h1>
          
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            Создай уникального персонажа и наблюдай, как он реагирует на твои достижения
          </p>
          
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto"></div>
        </motion.div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character display area */}
          <motion.div 
            className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-2xl -translate-y-8 translate-x-8"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-xl translate-y-4 -translate-x-4"></div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-[500px]">
              <AnimatedCharacter 
                customization={customization} 
                onInteraction={triggerMoodChange}
              />
              
              {/* Character name and mood display */}
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Твой компаньон</h3>
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    customization.mood === 'happy' ? 'bg-green-500' :
                    customization.mood === 'excited' ? 'bg-yellow-500' :
                    customization.mood === 'focused' ? 'bg-blue-500' :
                    customization.mood === 'tired' ? 'bg-gray-500' :
                    'bg-blue-400'
                  } animate-pulse`}></div>
                  <span className="text-sm text-gray-600 capitalize">
                    {customization.mood === 'idle' ? 'спокоен' :
                     customization.mood === 'happy' ? 'радуется' :
                     customization.mood === 'excited' ? 'взволнован' :
                     customization.mood === 'focused' ? 'сосредоточен' :
                     'устал'}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Customization panel */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Настройки</h3>
                <motion.button
                  onClick={() => setShowCustomization(!showCustomization)}
                  className="p-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </motion.button>
              </div>

              <AnimatePresence>
                {showCustomization && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CustomizationPanel 
                      customization={customization}
                      onUpdate={updateCustomization}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick mood buttons */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Настроение</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { mood: 'happy' as const, emoji: '😊', label: 'Радость' },
                    { mood: 'excited' as const, emoji: '🤩', label: 'Восторг' },
                    { mood: 'focused' as const, emoji: '🧠', label: 'Фокус' },
                    { mood: 'tired' as const, emoji: '😴', label: 'Усталость' }
                  ].map(({ mood, emoji, label }) => (
                    <motion.button
                      key={mood}
                      onClick={() => triggerMoodChange(mood)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        customization.mood === mood
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                          : 'bg-white/50 text-gray-700 hover:bg-white/70'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-lg mb-1">{emoji}</div>
                      <div className="text-xs">{label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Skeleton loading component
const CharacterSkeleton: React.FC = () => (
  <div className="relative min-h-screen">
    <div className="absolute inset-0 bg-gradient-to-br from-gray-200/30 via-gray-300/30 to-gray-400/30 rounded-3xl blur-3xl -z-10 transform scale-105 animate-pulse"></div>
    
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gray-300 rounded-3xl mx-auto mb-6 animate-pulse"></div>
        <div className="h-10 bg-gray-300 rounded-lg w-64 mx-auto mb-3 animate-pulse"></div>
        <div className="h-6 bg-gray-300 rounded-lg w-96 mx-auto mb-6 animate-pulse"></div>
        <div className="w-24 h-1 bg-gray-300 rounded-full mx-auto animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-200/50 rounded-3xl p-8 min-h-[500px] animate-pulse"></div>
        <div className="lg:col-span-1 bg-gray-200/50 rounded-3xl p-6 h-96 animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default CharacterTab;
