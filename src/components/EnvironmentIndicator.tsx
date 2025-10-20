import React from 'react';
import { config, isDevelopment } from '../config/environment';

interface EnvironmentIndicatorProps {
  showInProduction?: boolean;
}

export const EnvironmentIndicator: React.FC<EnvironmentIndicatorProps> = ({ 
  showInProduction = false 
}) => {
  // Не показываем в продакшене, если не указано иное
  if (!isDevelopment && !showInProduction) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`
        px-3 py-1 rounded-full text-xs font-medium
        ${isDevelopment 
          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
          : 'bg-green-100 text-green-800 border border-green-200'
        }
      `}>
        {config.env.toUpperCase()}
      </div>
    </div>
  );
};
