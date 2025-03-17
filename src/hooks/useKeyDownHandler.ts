import { useEffect } from 'react';

export function useKeyDownHandler(handler: (e: KeyboardEvent) => void): void {
  useEffect(() => {
    document.addEventListener('keydown', handler);
    return (): void => {
      document.removeEventListener('keydown', handler);
    };
  });
}
