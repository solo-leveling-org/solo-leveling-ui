import React from 'react';
import { useNavigate } from 'react-router-dom';
import TextType from '../../blocks/TextAnimations/TextType/TextType';

const WelcomeTab: React.FC = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/tasks');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0">
        {/* Primary floating orbs with better positioning */}
        <div className="absolute top-10 left-8 w-40 h-40 bg-gradient-to-br from-blue-400/25 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-32 right-12 w-32 h-32 bg-gradient-to-tr from-pink-400/20 to-orange-400/15 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute bottom-16 left-1/3 w-48 h-48 bg-gradient-to-bl from-indigo-400/15 to-blue-500/12 rounded-full blur-3xl animate-float-slow"></div>
        
        {/* Secondary subtle orbs for depth */}
        <div className="absolute top-1/4 right-1/3 w-20 h-20 bg-gradient-to-br from-cyan-400/12 to-blue-500/10 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-pink-400/8 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-emerald-400/8 to-teal-500/6 rounded-full blur-lg animate-float-slow"></div>
        
        {/* Additional depth layers */}
        <div className="absolute top-3/4 right-1/4 w-28 h-28 bg-gradient-to-bl from-violet-400/10 to-purple-500/8 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute bottom-1/3 right-1/2 w-20 h-20 bg-gradient-to-tr from-rose-400/8 to-pink-500/6 rounded-full blur-xl animate-float"></div>
      </div>

      {/* Main content with improved responsive design */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8 sm:py-12">
        <div className="text-center w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero section with enhanced glassmorphism */}
          <div 
            className="relative p-6 sm:p-8 md:p-12 lg:p-16 rounded-3xl backdrop-blur-xl border border-white/30 shadow-2xl mx-auto max-w-4xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.18))',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Enhanced card background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-gradient-to-br from-blue-400/30 to-purple-500/25 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-tr from-pink-400/25 to-orange-400/20 rounded-full blur-lg animate-pulse-delayed"></div>
            
            <div className="relative z-10">
              {/* Main animated text with improved responsive styling */}
              <div className="mb-8 sm:mb-12">
                <div className="flex justify-center items-center mb-6 sm:mb-8">
                  <div className="relative">
                    <TextType 
                      text={["Solo Leveling"]}
                      typingSpeed={75}
                      pauseDuration={1500}
                      showCursor={true}
                      cursorCharacter="|"
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 leading-tight"
                    />
                    
                    {/* Enhanced text glow effect */}
                    <div className="absolute inset-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-blue-600/15 blur-sm leading-tight">
                      <TextType 
                        text={["Solo Leveling"]}
                        typingSpeed={75}
                        pauseDuration={1500}
                        showCursor={false}
                        className="opacity-0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description with better responsive spacing */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium mb-8 sm:mb-12 px-4">
                Погрузитесь в мир одиночного развития и станьте сильнее с каждым заданием
              </p>

              {/* Action button with improved responsive design */}
              <div className="flex justify-center items-center">
                <button 
                  onClick={handleStartGame}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform text-sm sm:text-base md:text-lg"
                >
                  <span className="relative z-10">Начать игру</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Stats section with improved responsive grid */}
          <div className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[
              { label: 'Активных игроков', value: '1,234', icon: '👥' },
              { label: 'Выполнено задач', value: '5,678', icon: '✅' },
              { label: 'Уровней пройдено', value: '890', icon: '🏆' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="relative p-4 sm:p-6 lg:p-8 rounded-2xl backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
                }}
              >
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">{stat.icon}</div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">{stat.value}</div>
                  <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTab;
