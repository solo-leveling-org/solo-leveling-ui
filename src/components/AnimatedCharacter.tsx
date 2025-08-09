import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CharacterCustomization } from '../tabs/CharacterTab';

interface AnimatedCharacterProps {
  customization: CharacterCustomization;
  onInteraction?: (mood: CharacterCustomization['mood']) => void;
}

const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({ customization, onInteraction }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  // Автоматическое моргание каждые 3-6 секунд
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, Math.random() * 3000 + 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Показываем частицы при смене настроения
  useEffect(() => {
    if (customization.mood !== 'idle') {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 2000);
    }
  }, [customization.mood]);

  // Получаем цвета глаз в зависимости от настроения
  const getEyeVariant = () => {
    switch (customization.mood) {
      case 'happy': return 'happy';
      case 'excited': return 'excited';
      case 'focused': return 'focused';
      case 'tired': return 'tired';
      default: return 'normal';
    }
  };

    // Анимационные варианты для разных частей тела
  const getBodyAnimation = (mood: CharacterCustomization['mood']) => {
    switch (mood) {
      case 'idle':
        return {
          y: [0, -5, 0],
          rotate: [0, 1, -1, 0],
          transition: { 
            duration: 4, 
            repeat: Infinity,
            repeatType: "loop" as const
          }
        };
      case 'happy':
        return {
          y: [0, -15, -10, -15, 0],
          rotate: [0, 3, -3, 3, 0],
          scale: [1, 1.05, 1],
          transition: { 
            duration: 0.8, 
            repeat: 2
          }
        };
      case 'excited':
        return {
          y: [0, -20, -15, -25, -10, 0],
          rotate: [0, 5, -5, 10, -10, 0],
          scale: [1, 1.1, 0.95, 1.1, 1],
          transition: { 
            duration: 1.2, 
            repeat: 3
          }
        };
      case 'focused':
        return {
          scale: [1, 0.98, 1],
          transition: { 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop" as const
          }
        };
      case 'tired':
        return {
          y: [0, 2, 0],
          rotate: [0, -2, 0],
          transition: { 
            duration: 6, 
            repeat: Infinity,
            repeatType: "loop" as const
          }
        };
      default:
        return {
          y: [0, -5, 0],
          rotate: [0, 1, -1, 0],
          transition: { 
            duration: 4, 
            repeat: Infinity,
            repeatType: "loop" as const
          }
        };
    }
  };

  const getHeadAnimation = (mood: CharacterCustomization['mood']) => {
    switch (mood) {
      case 'idle':
        return {
          rotate: [0, 2, -2, 0],
          transition: { 
            duration: 5, 
            repeat: Infinity,
            repeatType: "loop" as const,
            delay: 1
          }
        };
      case 'happy':
        return {
          y: [0, -5, 0],
          rotate: [0, 5, -5, 0],
          transition: { 
            duration: 0.6, 
            repeat: 3
          }
        };
      case 'excited':
        return {
          y: [0, -8, -5, -8, 0],
          rotate: [0, 8, -8, 8, 0],
          transition: { 
            duration: 0.4, 
            repeat: 6
          }
        };
      case 'focused':
        return {
          y: [0, -2, 0],
          rotate: [0, 1, -1, 0],
          transition: { 
            duration: 3, 
            repeat: Infinity,
            repeatType: "loop" as const
          }
        };
      case 'tired':
        return {
          y: [0, 3, 0],
          rotate: [0, -3, -1, -3, 0],
          transition: { 
            duration: 8, 
            repeat: Infinity,
            repeatType: "loop" as const
          }
        };
      default:
        return {
          rotate: [0, 2, -2, 0],
          transition: { 
            duration: 5, 
            repeat: Infinity,
            repeatType: "loop" as const,
            delay: 1
          }
        };
    }
  };

  // Функция для обработки клика по персонажу
  const handleCharacterClick = () => {
    const moods: CharacterCustomization['mood'][] = ['happy', 'excited', 'focused'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    onInteraction?.(randomMood);
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Particle effects */}
      <AnimatePresence>
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 rounded-full ${
                  customization.mood === 'happy' ? 'bg-yellow-400' :
                  customization.mood === 'excited' ? 'bg-pink-400' :
                  customization.mood === 'focused' ? 'bg-blue-400' :
                  'bg-purple-400'
                }`}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0]
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                style={{
                  left: '50%',
                  top: '50%'
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main character container */}
      <motion.div
        className="relative cursor-pointer select-none"
        onClick={handleCharacterClick}
        animate={getBodyAnimation(customization.mood)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg 
          width="280" 
          height="350" 
          viewBox="0 0 280 350" 
          className="drop-shadow-2xl"
        >
          {/* Character shadow */}
          <ellipse
            cx="140"
            cy="330"
            rx="60"
            ry="15"
            fill="rgba(0,0,0,0.1)"
            className="opacity-50"
          />

          {/* Body */}
          <motion.g animate={getBodyAnimation(customization.mood)}>
            {/* Main body */}
            <ellipse
              cx="140"
              cy="250"
              rx="45"
              ry="65"
              fill={customization.outfit === 'casual' ? '#FF6B9D' : 
                   customization.outfit === 'formal' ? '#4A90E2' : 
                   '#F39C12'}
              stroke="#fff"
              strokeWidth="3"
            />
            
            {/* Body details */}
            <rect
              x="125"
              y="230"
              width="30"
              height="8"
              rx="4"
              fill="rgba(255,255,255,0.3)"
            />

            {/* Arms */}
            <motion.ellipse
              cx="105"
              cy="220"
              rx="15"
              ry="35"
              fill={customization.skinColor}
              stroke="#fff"
              strokeWidth="2"
              animate={{
                rotate: [0, 10, 0, -5, 0],
                transition: { 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }
              }}
              style={{ transformOrigin: '105px 190px' }}
            />
            <motion.ellipse
              cx="175"
              cy="220"
              rx="15"
              ry="35"
              fill={customization.skinColor}
              stroke="#fff"
              strokeWidth="2"
              animate={{
                rotate: [0, -10, 0, 5, 0],
                transition: { 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }
              }}
              style={{ transformOrigin: '175px 190px' }}
            />

            {/* Legs */}
            <ellipse
              cx="125"
              cy="300"
              rx="12"
              ry="25"
              fill={customization.skinColor}
              stroke="#fff"
              strokeWidth="2"
            />
            <ellipse
              cx="155"
              cy="300"
              rx="12"
              ry="25"
              fill={customization.skinColor}
              stroke="#fff"
              strokeWidth="2"
            />
          </motion.g>

          {/* Head */}
          <motion.g animate={getHeadAnimation(customization.mood)}>
            {/* Main head */}
            <circle
              cx="140"
              cy="120"
              r="55"
              fill={customization.skinColor}
              stroke="#fff"
              strokeWidth="3"
            />

            {/* Hair */}
            <motion.g>
              {customization.hairStyle === 'short' && (
                <path
                  d="M90 95 Q140 70 190 95 Q185 85 140 85 Q95 85 90 95"
                  fill={customization.hairColor}
                  stroke="#fff"
                  strokeWidth="2"
                />
              )}
              {customization.hairStyle === 'long' && (
                <>
                  <path
                    d="M85 90 Q140 65 195 90 Q190 80 140 80 Q90 80 85 90"
                    fill={customization.hairColor}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <path
                    d="M85 90 Q80 130 90 160 Q95 155 95 140 Q95 110 85 90"
                    fill={customization.hairColor}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <path
                    d="M195 90 Q200 130 190 160 Q185 155 185 140 Q185 110 195 90"
                    fill={customization.hairColor}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                </>
              )}
              {customization.hairStyle === 'curly' && (
                <>
                  <circle cx="115" cy="85" r="12" fill={customization.hairColor} stroke="#fff" strokeWidth="1"/>
                  <circle cx="140" cy="75" r="15" fill={customization.hairColor} stroke="#fff" strokeWidth="1"/>
                  <circle cx="165" cy="85" r="12" fill={customization.hairColor} stroke="#fff" strokeWidth="1"/>
                  <circle cx="105" cy="105" r="8" fill={customization.hairColor} stroke="#fff" strokeWidth="1"/>
                  <circle cx="175" cy="105" r="8" fill={customization.hairColor} stroke="#fff" strokeWidth="1"/>
                </>
              )}
            </motion.g>

            {/* Eyes */}
            <motion.g>
              {/* Left eye */}
              <ellipse
                cx="120"
                cy="110"
                rx="12"
                ry={isBlinking ? "2" : getEyeVariant() === 'tired' ? "8" : "15"}
                fill="white"
                stroke="#333"
                strokeWidth="2"
              />
              {!isBlinking && (
                <>
                  <circle
                    cx="120"
                    cy="110"
                    r={getEyeVariant() === 'excited' ? "8" : "6"}
                    fill={customization.eyeColor}
                  />
                  <circle
                    cx={getEyeVariant() === 'happy' ? "122" : "121"}
                    cy={getEyeVariant() === 'focused' ? "108" : "109"}
                    r="2"
                    fill="white"
                  />
                </>
              )}

              {/* Right eye */}
              <ellipse
                cx="160"
                cy="110"
                rx="12"
                ry={isBlinking ? "2" : getEyeVariant() === 'tired' ? "8" : "15"}
                fill="white"
                stroke="#333"
                strokeWidth="2"
              />
              {!isBlinking && (
                <>
                  <circle
                    cx="160"
                    cy="110"
                    r={getEyeVariant() === 'excited' ? "8" : "6"}
                    fill={customization.eyeColor}
                  />
                  <circle
                    cx={getEyeVariant() === 'happy' ? "162" : "161"}
                    cy={getEyeVariant() === 'focused' ? "108" : "109"}
                    r="2"
                    fill="white"
                  />
                </>
              )}
            </motion.g>

            {/* Nose */}
            <ellipse
              cx="140"
              cy="125"
              rx="3"
              ry="2"
              fill="rgba(0,0,0,0.1)"
            />

            {/* Mouth */}
            <motion.path
              d={
                customization.mood === 'happy' ? "M125 140 Q140 155 155 140" :
                customization.mood === 'excited' ? "M120 140 Q140 165 160 140" :
                customization.mood === 'focused' ? "M130 145 L150 145" :
                customization.mood === 'tired' ? "M125 150 Q140 140 155 150" :
                "M130 145 Q140 150 150 145"
              }
              stroke="#FF6B9D"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              animate={{
                d: customization.mood !== 'idle' ? [
                  customization.mood === 'happy' ? "M125 140 Q140 155 155 140" :
                  customization.mood === 'excited' ? "M120 140 Q140 165 160 140" :
                  customization.mood === 'focused' ? "M130 145 L150 145" :
                  customization.mood === 'tired' ? "M125 150 Q140 140 155 150" :
                  "M130 145 Q140 150 150 145",
                  "M130 145 Q140 150 150 145",
                  customization.mood === 'happy' ? "M125 140 Q140 155 155 140" :
                  customization.mood === 'excited' ? "M120 140 Q140 165 160 140" :
                  customization.mood === 'focused' ? "M130 145 L150 145" :
                  customization.mood === 'tired' ? "M125 150 Q140 140 155 150" :
                  "M130 145 Q140 150 150 145"
                ] : undefined,
                transition: customization.mood !== 'idle' ? {
                  duration: 0.5,
                  repeat: 2,
                  repeatType: "reverse"
                } : undefined
              }}
            />

            {/* Cheeks when happy */}
            <AnimatePresence>
              {(customization.mood === 'happy' || customization.mood === 'excited') && (
                <>
                  <motion.circle
                    cx="100"
                    cy="125"
                    r="8"
                    fill="#FFB6C1"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  />
                  <motion.circle
                    cx="180"
                    cy="125"
                    r="8"
                    fill="#FFB6C1"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  />
                </>
              )}
            </AnimatePresence>

            {/* Accessory */}
            {customization.accessory === 'glasses' && (
              <g>
                <circle cx="120" cy="110" r="18" fill="none" stroke="#333" strokeWidth="2"/>
                <circle cx="160" cy="110" r="18" fill="none" stroke="#333" strokeWidth="2"/>
                <line x1="138" y1="110" x2="142" y2="110" stroke="#333" strokeWidth="2"/>
              </g>
            )}
            {customization.accessory === 'hat' && (
              <ellipse cx="140" cy="75" rx="35" ry="15" fill="#FF6B9D" stroke="#fff" strokeWidth="2"/>
            )}
            {customization.accessory === 'bow' && (
              <path 
                d="M140 85 Q125 80 120 85 Q125 90 140 85 Q155 80 160 85 Q155 90 140 85" 
                fill="#FF1744" 
                stroke="#fff" 
                strokeWidth="1"
              />
            )}
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
};

export default AnimatedCharacter;
