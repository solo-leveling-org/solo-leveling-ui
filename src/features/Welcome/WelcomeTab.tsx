import React from 'react';
import TextType from '../../blocks/TextAnimations/TextType/TextType';

const WelcomeTab: React.FC = () => {
  return (
    <TextType 
        text={["Text typing effect", "for your websites", "Happy coding!"]}
        typingSpeed={75}
        pauseDuration={1500}
        showCursor={true}
        cursorCharacter="|" 
        className="text-type-container"
    />
  );
};

export default WelcomeTab;
