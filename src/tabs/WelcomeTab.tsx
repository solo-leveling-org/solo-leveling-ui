import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextType from '../blocks/TextAnimations/TextType/TextType';
import { useLocalization } from '../hooks/useLocalization';
import { cn } from '../utils';

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
    <div 
      className="fixed inset-0 flex items-center justify-center overflow-hidden" 
      style={{ 
        background: 'linear-gradient(135deg, #000000 0%, #0a0e1a 50%, #0d1220 100%)',
        boxSizing: 'border-box',
        zIndex: 1
      }}
    >
      {/* Holographic grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(200, 230, 245, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 230, 245, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center center'
        }}></div>
      </div>

      {/* Animated scan lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[2px] animate-scan-line" style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(220, 235, 245, 0.5) 50%, transparent 100%)'
        }}></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15" style={{
        background: 'rgba(180, 216, 232, 0.8)'
      }}></div>
      <div className="absolute bottom-1/3 right-1/3 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-10" style={{
        background: 'rgba(200, 230, 245, 0.6)'
      }}></div>

      {/* Main holographic container */}
      <div className={cn(
        "relative w-full max-w-2xl lg:max-w-3xl mx-4 md:mx-6 transition-all duration-1000 ease-out",
        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      )}>
        {/* Outer holographic border frame */}
        <div className="relative px-6 py-10 md:px-12 md:py-16" style={{
          background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(220, 235, 245, 0.2)',
          borderRadius: '24px',
          boxShadow: `
            0 0 20px rgba(180, 220, 240, 0.15),
            inset 0 0 20px rgba(200, 230, 245, 0.03)
          `
        }}>

          {/* Content */}
          <div className="relative z-10 space-y-6 md:space-y-10">

            {/* Subtitle message */}
            <div className="text-center px-2">
              <p className="font-tech text-xs md:text-base tracking-wide leading-relaxed" style={{
                color: 'rgba(220, 235, 245, 0.7)'
              }}>
                {t('welcome.subtitle')}
              </p>
            </div>

            {/* Main title section */}
            <div className="text-center space-y-4 md:space-y-6">

              {/* Animated title */}
              <div className="relative px-2 whitespace-nowrap overflow-x-auto">
                <TextType 
                  text={[t('welcome.title')]}
                  typingSpeed={80}
                  pauseDuration={2000}
                  showCursor={true}
                  cursorCharacter="_"
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-tech font-bold uppercase tracking-wide !whitespace-nowrap"
                  textColors={['#e8f4f8']}
                />
              <style>{`
                  .text-2xl,
                  .text-3xl,
                  .text-4xl {
                    white-space: nowrap !important;
                    word-break: keep-all !important;
                    overflow-wrap: normal !important;
                  }
                  .text-2xl span,
                  .text-3xl span,
                  .text-4xl span {
                    color: #e8f4f8 !important;
                    text-shadow: 
                      0 0 8px rgba(180, 220, 240, 0.3),
                      0 0 15px rgba(160, 210, 235, 0.15);
                    letter-spacing: 0.05em;
                    white-space: nowrap !important;
                  }
              `}</style>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center pt-2 md:pt-4 px-2">
              <button
                onClick={handleStartGame}
                className="group relative px-8 md:px-12 py-3 md:py-4 border-2 bg-transparent font-tech text-sm md:text-lg tracking-[0.15em] md:tracking-[0.2em] uppercase transition-all duration-300 w-full max-w-xs md:w-auto"
                style={{ 
                  borderColor: 'rgba(220, 235, 245, 0.5)',
                  color: '#e8f4f8',
                  boxShadow: '0 0 15px rgba(180, 220, 240, 0.2)'
                }}
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  {t('welcome.startButton')}
                </span>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>

            {/* Bottom warning/status */}
            <div className="text-center pt-2 md:pt-4">
              <div className="inline-flex items-center gap-2 md:gap-3 text-[10px] md:text-sm font-tech tracking-wider" style={{
                color: 'rgba(220, 235, 245, 0.5)'
              }}>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse"
                     style={{ 
                       backgroundColor: '#b4d8e8',
                       boxShadow: '0 0 8px rgba(180, 216, 232, 0.6)'
                     }}></div>
                <span className="uppercase">SYSTEM ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTab;
