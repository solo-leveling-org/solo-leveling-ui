import { useEffect } from 'react';

/**
 * Хук для блокировки скролла фонового контента при открытии диалога
 * Использует простую блокировку на body и блокирует все элементы с overflow-y-auto
 * 
 * ВАЖНО: Диалоги должны использовать `fixed inset-0` для правильного позиционирования
 * относительно viewport, а не body. Этот хук не должен влиять на позиционирование диалогов.
 */
export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return;

    // Сохраняем текущую позицию скролла window
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    
    // Также сохраняем позицию скролла контейнера (если скролл происходит на контейнере, а не на window)
    const scrollableContainer = document.querySelector('.fixed.inset-0.overflow-y-auto') as HTMLElement;
    const containerScrollTop = scrollableContainer?.scrollTop || 0;
    
    const body = document.body;

    // Сохраняем текущие стили для восстановления
    const originalBodyPosition = body.style.position;
    const originalBodyTop = body.style.top;
    const originalBodyWidth = body.style.width;
    const originalBodyOverflow = body.style.overflow;
    
    // Флаг: скролл происходит на контейнере
    const isContainerScrolling = containerScrollTop > 0;

    // Находим все элементы с overflow-y-auto (контейнеры табов) и сохраняем их позицию скролла
    // НО исключаем элементы внутри диалогов (BaseDialog, BottomSheet), чтобы скролл внутри них работал
    const scrollableContainers: Array<{ 
      element: HTMLElement; 
      originalOverflow: string;
      originalScrollTop: number;
    }> = [];
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      // Проверяем, не находится ли элемент внутри диалога
      const isInsideDialog = htmlEl.closest('.base-dialog-content, .bottom-sheet, .task-completion-overlay') !== null;
      if (isInsideDialog) {
        return; // Пропускаем элементы внутри диалогов
      }
      const computedStyle = window.getComputedStyle(htmlEl);
      if (computedStyle.overflowY === 'auto' || computedStyle.overflowY === 'scroll') {
        scrollableContainers.push({
          element: htmlEl,
          originalOverflow: htmlEl.style.overflowY || '',
          originalScrollTop: htmlEl.scrollTop
        });
        htmlEl.style.overflowY = 'hidden';
      }
    });

    // Блокируем скролл на body (как было в оригинале)
    // ВАЖНО: Если скролл происходит на контейнере, НЕ сдвигаем body,
    // чтобы диалоги с fixed позиционировались правильно относительно viewport
    if (containerScrollTop === 0) {
      // Скролл происходит на window - используем стандартную блокировку
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';
    } else {
      // Скролл происходит на контейнере - только блокируем overflow, не сдвигаем body
      body.style.overflow = 'hidden';
    }

    // Cleanup при размонтировании
    return () => {
      // Восстанавливаем стили body
      if (isContainerScrolling) {
        // Если скролл был на контейнере, восстанавливаем только overflow
        body.style.overflow = originalBodyOverflow;
      } else {
        // Если скролл был на window, восстанавливаем все стили
        body.style.position = originalBodyPosition;
        body.style.top = originalBodyTop;
        body.style.width = originalBodyWidth;
        body.style.overflow = originalBodyOverflow;
      }

      // Восстанавливаем overflow-y и позицию скролла для всех контейнеров
      scrollableContainers.forEach(({ element, originalOverflow, originalScrollTop }) => {
        element.style.overflowY = originalOverflow;
        // Восстанавливаем позицию скролла контейнера
        if (originalOverflow === '' || originalOverflow === 'auto' || originalOverflow === 'scroll') {
          element.scrollTop = originalScrollTop;
        }
      });

      // Восстанавливаем позицию скролла window
      // Используем requestAnimationFrame для правильного восстановления
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    };
  }, [isLocked]);
};

