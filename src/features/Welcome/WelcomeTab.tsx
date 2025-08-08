import React from 'react';
import TextType from '../../blocks/TextAnimations/TextType/TextType';

const WelcomeTab: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-tr from-pink-400/15 to-orange-400/15 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-bl from-indigo-400/10 to-blue-500/10 rounded-full blur-3xl animate-float-slow"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero section with glassmorphism card */}
          <div 
            className="relative p-8 md:p-12 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Card background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-pink-400/15 to-orange-400/15 rounded-full blur-lg animate-pulse-delayed"></div>
            
            <div className="relative z-10">
              {/* Welcome text */}
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 tracking-tight">
                  Добро пожаловать в
                </h1>
                
                {/* Main animated text */}
                <div className="flex justify-center items-center mb-8">
                  <div className="relative">
                    <TextType 
                      text={[
                        "Solo Leveling",
                        "Добро пожаловать",
                        "Готов к развитию?",
                        "Начнем игру"
                      ]}
                      typingSpeed={75}
                      pauseDuration={1500}
                      showCursor={true}
                      cursorCharacter="|"
                      className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"
                    />
                    
                    {/* Text glow effect */}
                    <div className="absolute inset-0 text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600/20 blur-sm">
                      <TextType 
                        text={[
                          "Solo Leveling",
                          "Добро пожаловать",
                          "Готов к развитию?",
                          "Начнем игру"
                        ]}
                        typingSpeed={75}
                        pauseDuration={1500}
                        showCursor={false}
                        className="opacity-0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto font-medium">
                Погрузитесь в мир одиночного развития и станьте сильнее с каждым заданием
              </p>

              {/* Action buttons */}
              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <span className="relative z-10">Начать игру</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <button className="group relative overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30 text-gray-700 px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <span className="relative z-10">Узнать больше</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Stats section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Активных игроков', value: '1,234', icon: '👥' },
              { label: 'Выполнено задач', value: '5,678', icon: '✅' },
              { label: 'Уровней пройдено', value: '890', icon: '🏆' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="relative p-6 rounded-2xl backdrop-blur-sm border border-white/20"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                }}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
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
