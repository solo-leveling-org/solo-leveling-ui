import React from 'react';
import TextType from '../../blocks/TextAnimations/TextType/TextType';

const WelcomeTab: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Добро пожаловать в
          </h1>
          <div className="flex justify-center items-center">
            <TextType 
              text={["Solo Leveling"]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              className="text-black"
            />
          </div>
        </div>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Погрузитесь в мир одиночного развития и станьте сильнее с каждым заданием
        </p>
      </div>
    </div>
  );
};

export default WelcomeTab;
