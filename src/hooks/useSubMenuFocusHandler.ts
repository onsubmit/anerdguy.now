import { RefObject, useCallback, useEffect, useImperativeHandle, useState } from 'react';

import { SubMenuParams } from '../components/sub-menu';

export function useSubMenuFocusHandler({
  ref,
  listRef,
  disable,
}: {
  ref: SubMenuParams['ref'];
  listRef: RefObject<HTMLUListElement | null>;
  disable: boolean;
}): React.Dispatch<React.SetStateAction<number | null>> {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const reset = useCallback((): void => setFocusedIndex(null), []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (disable) {
        return;
      }

      if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
        const list = listRef.current;
        if (!list) {
          return;
        }

        const amount = e.key === 'ArrowDown' ? 1 : -1;
        const enabledChildrenIndices = [...list.children]
          .map((e, i) => (e.firstElementChild?.getAttribute('disabled') === '' ? undefined : i))
          .filter((i) => i !== undefined);
        const enabledChildren = enabledChildrenIndices.length;

        let newIndex = null;
        if (focusedIndex === null) {
          newIndex =
            amount === 1 ? enabledChildrenIndices[0] : enabledChildrenIndices[enabledChildren - 1];
        } else {
          let enabledIndex = enabledChildrenIndices.findIndex((i) => i === focusedIndex);
          enabledIndex = (enabledIndex + amount) % enabledChildren;
          if (enabledIndex < 0) {
            enabledIndex = enabledChildren - 1;
          }
          newIndex = enabledChildrenIndices[enabledIndex];
        }

        const child = list.children[newIndex];
        if (child.firstElementChild instanceof HTMLElement) {
          child.firstElementChild.focus();
        }
        setFocusedIndex(newIndex);
      }
    },
    [disable, focusedIndex, listRef],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useImperativeHandle(ref, () => {
    return { reset };
  });

  return setFocusedIndex;
}
