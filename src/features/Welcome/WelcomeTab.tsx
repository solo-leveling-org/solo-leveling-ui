import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextType from '../../blocks/TextAnimations/TextType/TextType';

const WelcomeTab: React.FC = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleStartGame = () => {
    navigate('/tasks');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-6xl mx-auto">
          {/* Hero section */}
          <div className={`text-center mb-12 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Main title with enhanced typography */}
            <div className="mb-8">
              <div className="relative inline-block">
                <TextType 
                  text={["Solo Leveling"]}
                  typingSpeed={100}
                  pauseDuration={2000}
                  showCursor={true}
                  cursorCharacter="|"
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white leading-none tracking-tight"
                />
                {/* Glow effect */}
                <div className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-purple-400/20 blur-lg leading-none tracking-tight">
                  <TextType 
                    text={["Solo Leveling"]}
                    typingSpeed={100}
                    pauseDuration={2000}
                    showCursor={false}
                    className="opacity-0"
                  />
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 leading-relaxed max-w-4xl mx-auto font-light mb-12">
              Погрузитесь в мир одиночного развития и станьте сильнее с каждым заданием
            </p>

            {/* CTA Button */}
            <div className="flex justify-center">
              <button 
                onClick={handleStartGame}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6 rounded-2xl font-bold text-lg sm:text-xl md:text-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 transform"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span>Начать игру</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              </button>
            </div>
          </div>

          {/* Stats section with modern cards */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {[
              { 
                label: 'Активных игроков', 
                value: '1,234', 
                icon: '👥',
                gradient: 'from-blue-500/20 to-cyan-500/20',
                borderColor: 'border-blue-500/30',
                bgGradient: 'from-blue-500/10 to-cyan-500/10'
              },
              { 
                label: 'Выполнено задач', 
                value: '5,678', 
                icon: '✅',
                gradient: 'from-green-500/20 to-emerald-500/20',
                borderColor: 'border-green-500/30',
                bgGradient: 'from-green-500/10 to-emerald-500/10'
              },
              { 
                label: 'Уровней пройдено', 
                value: '890', 
                icon: '🏆',
                gradient: 'from-yellow-500/20 to-orange-500/20',
                borderColor: 'border-yellow-500/30',
                bgGradient: 'from-yellow-500/10 to-orange-500/10'
              }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`relative p-6 sm:p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 hover:shadow-2xl ${stat.borderColor} bg-gradient-to-br ${stat.bgGradient} hover:bg-gradient-to-br ${stat.gradient}`}
                style={{
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
                }}
              >
                {/* Card glow effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${stat.gradient} opacity-0 hover:opacity-100 transition-opacity duration-500 blur-xl`}></div>
                
                <div className="relative z-10 text-center">
                  <div className="text-4xl sm:text-5xl mb-4 animate-bounce">{stat.icon}</div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm sm:text-base lg:text-lg text-gray-300 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional features section */}
          <div className={`mt-16 sm:mt-20 text-center transition-all duration-1000 delay-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { icon: '⚡', title: 'Быстрый старт', desc: 'Начните играть мгновенно' },
                { icon: '🎯', title: 'Целевые задания', desc: 'Развивайтесь по плану' },
                { icon: '📈', title: 'Прогресс', desc: 'Отслеживайте рост' },
                { icon: '🏅', title: 'Достижения', desc: 'Получайте награды' }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-white/5 to-white/2"
                >
                  <div className="text-3xl mb-3 animate-pulse">{feature.icon}</div>
                  <div className="text-white font-semibold mb-2">{feature.title}</div>
                  <div className="text-gray-400 text-sm">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping delay-2000"></div>
      
      {/* Additional floating particles */}
      <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-500"></div>
      <div className="absolute bottom-1/3 right-1/6 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping delay-1500"></div>
      <div className="absolute top-2/3 left-1/2 w-1 h-1 bg-green-400 rounded-full animate-ping delay-2500"></div>
    </div>
  );
};

export default WelcomeTab;
