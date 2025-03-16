import { RefObject, useCallback, useEffect, useState } from 'react';

export function useSubMenuFocusHandler(listRef: RefObject<HTMLUListElement | null>): void {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
        const list = listRef.current;
        if (!list) {
          return;
        }

        const amount = e.key === 'ArrowDown' ? 1 : -1;

        let newIndex = null;
        if (focusedIndex === null) {
          newIndex = amount === 1 ? 0 : list.childElementCount - 1;
        } else {
          newIndex = (focusedIndex + amount) % list.childElementCount;
          if (newIndex < 0) {
            newIndex = list.childElementCount - 1;
          }
        }

        const child = list.children[newIndex];
        if (child.firstElementChild instanceof HTMLElement) {
          child.firstElementChild.focus();
        }
        setFocusedIndex(newIndex);
      }
    },
    [focusedIndex, listRef],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
