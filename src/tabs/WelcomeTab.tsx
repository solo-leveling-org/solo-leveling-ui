import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextType from '../blocks/TextAnimations/TextType/TextType';
import { useLocalization } from '../hooks/useLocalization';

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
    <div className="flex items-center justify-center px-4 -my-10" style={{ height: 'calc(100vh - 80px)' }}>
      <div className={`text-center transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Main title */}
        <div className="mb-8">
          <div className="relative inline-block">
            <TextType 
              text={[t('welcome.title')]}
              typingSpeed={100}
              pauseDuration={2000}
              showCursor={true}
              cursorCharacter="_"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 tracking-tight"
            />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-gray-600 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
          {t('welcome.subtitle')}
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button 
            onClick={handleStartGame}
            className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-12 py-5 rounded-3xl font-semibold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1"
          >
            <span className="relative z-10">
              {t('welcome.startButton')}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTab;
