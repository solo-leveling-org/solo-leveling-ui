import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextType from '../blocks/TextAnimations/TextType/TextType';
import { useLocalization } from '../hooks/useLocalization';
import Icon from '../components/Icon';

const WelcomeTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLocalization();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleStartGame = () => {
    navigate('/tasks');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/8 to-purple-400/8 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-gradient-to-tr from-pink-400/8 to-orange-400/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/5 to-emerald-400/5 rounded-full blur-2xl"></div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Hero section */}
        <div className={`text-center mb-12 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Main title */}
          <div className="mb-8">
            <div className="relative inline-block">
              <TextType 
                text={[t('welcome.title')]}
                typingSpeed={100}
                pauseDuration={2000}
                showCursor={true}
                cursorCharacter="_"
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight"
              />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('welcome.subtitle')}
          </p>

          {/* CTA Button */}
          <div className="flex justify-center mb-12">
            <button 
              onClick={handleStartGame}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>{t('welcome.startButton')}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Divider */}
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-12"></div>
        </div>

        {/* Stats section */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12 transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                      {[
              { 
                label: t('welcome.stats.activePlayers'), 
                value: '1,234', 
                icon: '👥',
                color: 'from-blue-500 to-cyan-500'
              },
              { 
                label: t('welcome.stats.completedTasks'), 
                value: '5,678', 
                icon: <Icon type="check" size={24} />,
                color: 'from-green-500 to-emerald-500'
              },
              { 
                label: t('welcome.stats.levelsPassed'), 
                value: '890', 
                icon: '🏆',
                color: 'from-yellow-500 to-orange-500'
              }
            ].map((stat, index) => (
            <div 
              key={index}
              className="relative p-6 rounded-3xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              }}
            >
              {/* Card glow effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${stat.color} opacity-0 hover:opacity-10 transition-opacity duration-500 blur-xl`}></div>
              
              <div className="relative z-10 text-center">
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Features section */}
        <div className={`max-w-5xl mx-auto transition-all duration-1000 delay-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: <Icon type="cloud-lightning" size={24} />, title: t('welcome.features.quickStart.title'), desc: t('welcome.features.quickStart.description') },
              { icon: <Icon type="target" size={24} />, title: t('welcome.features.targetedTasks.title'), desc: t('welcome.features.targetedTasks.description') },
              { icon: <Icon type="trending-up" size={24} />, title: t('welcome.features.progress.title'), desc: t('welcome.features.progress.description') },
              { icon: <Icon type="award" size={24} />, title: t('welcome.features.achievements.title'), desc: t('welcome.features.achievements.description') }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              >
                <div className="flex justify-center items-center mb-3">{feature.icon}</div>
                <div className="text-gray-800 font-semibold mb-2">{feature.title}</div>
                <div className="text-gray-600 text-sm">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTab;
