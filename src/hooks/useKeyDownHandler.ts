import { useEffect } from 'react';

export function useKeyDownHandler(hander: (e: KeyboardEvent) => void): void {
  useEffect(() => {
    document.addEventListener('keydown', hander);
    return (): void => {
      document.removeEventListener('keydown', hander);
    };
  });
}
