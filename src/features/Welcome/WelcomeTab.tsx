import React from 'react';
import TextType from '../../blocks/TextAnimations/TextType/TextType';

const WelcomeTab: React.FC = () => {
  return (
    <div className="flex items-start justify-center h-screen bg-white p-4 pt-20 overflow-hidden">
      <div className="text-center">
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
          className="text-black"
        />
      </div>
    </div>
  );
};

export default WelcomeTab;
