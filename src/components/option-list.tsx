import { RefObject, useCallback, useImperativeHandle, useRef, useState } from 'react';

import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import styles from './option-list.module.css';

export type OptionListParams<T extends string> = {
  options: ReadonlyArray<T>;
  selectedOption: T;
  setSelectedOption: React.Dispatch<React.SetStateAction<T>>;
  onSelectionChange?: (option: T) => void;
  onDoubleClick?: (option: T) => void;
  filter?: RegExp;
  ref?: RefObject<OptionListOperations<T> | null>;
};

export type OptionListOperations<T> = {
  reselect: (option: T) => void;
  focus: (option: T) => void;
  hasActiveElement: () => boolean;
};

export function OptionsList<T extends string>({
  options,
  selectedOption,
  setSelectedOption,
  onSelectionChange,
  onDoubleClick,
  filter,
  ref,
}: OptionListParams<T>): React.JSX.Element {
  const ulRef = useRef<HTMLUListElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
        const list = ulRef.current;
        if (!list || !list.contains(document.activeElement)) {
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
          enabledIndex = Math.min(enabledIndex + amount, enabledChildren - 1);
          if (enabledIndex < 0) {
            return;
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
    [focusedIndex],
  );

  useKeyDownHandler(handleKeyDown);

  useImperativeHandle(ref, () => {
    return {
      reselect: (option: T): void => {
        ulRef.current
          ?.querySelector(`li[data-value="${option}"]`)
          ?.scrollIntoView({ behavior: 'instant', block: 'center' });
      },
      focus: (option: T): void => {
        (
          ulRef.current?.querySelector(`li[data-value="${option}"]`)
            ?.firstElementChild as HTMLButtonElement
        )?.focus();
      },
      hasActiveElement: (): boolean => ulRef.current?.contains(document.activeElement) ?? false,
    };
  });

  return (
    <ul ref={ulRef} className={styles.optionList}>
      {options.map((option, i) => {
        if (filter && !filter.exec(option)) {
          return;
        }

        return (
          <li
            key={option}
            data-value={option}
            className={option === selectedOption ? styles.active : undefined}
            onClick={() => {
              setSelectedOption(option);
              setFocusedIndex(i);
              onSelectionChange?.(option);
            }}
            onDoubleClick={() => onDoubleClick?.(option)}
          >
            <button type="button">{option}</button>
          </li>
        );
      })}
    </ul>
  );
}
