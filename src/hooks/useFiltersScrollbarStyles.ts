import { useEffect, useRef } from 'react';

/**
 * Хук для применения кастомных стилей скроллбара для фильтров
 * Гарантирует правильное отображение на desktop и скрытие на мобильных устройствах
 */
export function useFiltersScrollbarStyles(styleId: string = 'filters-scrollbar-styles') {
  const styleTagRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    // Проверяем, не создан ли уже стиль с таким ID
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      styleTagRef.current = existingStyle as HTMLStyleElement;
      return;
    }

    if (!styleTagRef.current) {
      const isMobile = document.body.classList.contains('mobile-version');
      
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Скрытие на мобильных устройствах */
        .mobile-version .filters-scrollbar,
        body.mobile-version .filters-scrollbar,
        html.mobile-version .filters-scrollbar {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
          scrollbar-color: transparent transparent !important;
        }
        .mobile-version .filters-scrollbar::-webkit-scrollbar,
        body.mobile-version .filters-scrollbar::-webkit-scrollbar,
        html.mobile-version .filters-scrollbar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          background: transparent !important;
          -webkit-appearance: none !important;
          appearance: none !important;
        }
        .mobile-version .filters-scrollbar::-webkit-scrollbar-track,
        body.mobile-version .filters-scrollbar::-webkit-scrollbar-track {
          display: none !important;
          background: transparent !important;
        }
        .mobile-version .filters-scrollbar::-webkit-scrollbar-thumb,
        body.mobile-version .filters-scrollbar::-webkit-scrollbar-thumb {
          display: none !important;
          background: transparent !important;
        }
        
        /* Стили для desktop */
        .desktop-version .filters-scrollbar::-webkit-scrollbar,
        body.desktop-version .filters-scrollbar::-webkit-scrollbar {
          display: block !important;
          height: 6px !important;
          width: 6px !important;
          -webkit-appearance: none !important;
          appearance: none !important;
          background: transparent !important;
        }
        .desktop-version .filters-scrollbar::-webkit-scrollbar-track,
        body.desktop-version .filters-scrollbar::-webkit-scrollbar-track {
          background: rgba(10, 14, 39, 0.3) !important;
          border-radius: 10px !important;
          -webkit-appearance: none !important;
          appearance: none !important;
        }
        .desktop-version .filters-scrollbar::-webkit-scrollbar-thumb,
        body.desktop-version .filters-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(180, 220, 240, 0.4) !important;
          border-radius: 10px !important;
          border: 1px solid rgba(180, 220, 240, 0.2) !important;
          box-shadow: 0 0 8px rgba(180, 220, 240, 0.3) !important;
          -webkit-appearance: none !important;
          appearance: none !important;
        }
        .desktop-version .filters-scrollbar::-webkit-scrollbar-thumb:hover,
        body.desktop-version .filters-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(180, 220, 240, 0.6) !important;
          box-shadow: 0 0 12px rgba(180, 220, 240, 0.5) !important;
        }
        
        /* Fallback для desktop (если класс не установлен) */
        ${!isMobile ? `
        .filters-scrollbar::-webkit-scrollbar {
          display: block !important;
          height: 6px !important;
          width: 6px !important;
          -webkit-appearance: none !important;
          appearance: none !important;
          background: transparent !important;
        }
        .filters-scrollbar::-webkit-scrollbar-track {
          background: rgba(10, 14, 39, 0.3) !important;
          border-radius: 10px !important;
          -webkit-appearance: none !important;
          appearance: none !important;
        }
        .filters-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(180, 220, 240, 0.4) !important;
          border-radius: 10px !important;
          border: 1px solid rgba(180, 220, 240, 0.2) !important;
          box-shadow: 0 0 8px rgba(180, 220, 240, 0.3) !important;
          -webkit-appearance: none !important;
          appearance: none !important;
        }
        .filters-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(180, 220, 240, 0.6) !important;
          box-shadow: 0 0 12px rgba(180, 220, 240, 0.5) !important;
        }
        ` : ''}
      `;
      document.head.appendChild(style);
      styleTagRef.current = style;
    }
    
    return () => {
      // Не удаляем стиль при размонтировании, так как он может использоваться другими компонентами
      // Стиль будет удален только при полной перезагрузке страницы
    };
  }, [styleId]);
}
