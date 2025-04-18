import { useEffect } from 'react';

export function useCustomEvent<T = any>(
  events: Array<{ name: string; handler: (event: CustomEventInit<T>) => void }>,
): void {
  return useEffect(() => {
    events.forEach(({ name, handler }) => document.addEventListener(name, handler));
    return (): void =>
      events.forEach(({ name, handler }) => document.removeEventListener(name, handler));
  }, [events]);
}
