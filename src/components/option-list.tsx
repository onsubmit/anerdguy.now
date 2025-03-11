import { RefObject, useImperativeHandle, useRef } from 'react';

import styles from './option-list.module.css';

export type OptionListParams<T extends string> = {
  options: ReadonlyArray<T>;
  selectedOption: T;
  setSelectedOption: React.Dispatch<React.SetStateAction<T>>;
  onSelectionChange?: (color: T) => void;
  ref?: RefObject<OptionListOperations<T> | null>;
};

export type OptionListOperations<T> = {
  refocus: (option: T) => void;
};

export function OptionsList<T extends string>({
  options,
  selectedOption,
  setSelectedOption,
  onSelectionChange,
  ref,
}: OptionListParams<T>): React.JSX.Element {
  const ulRef = useRef<HTMLUListElement>(null);

  useImperativeHandle(ref, () => {
    return {
      refocus: (option: T): void => {
        ulRef.current
          ?.querySelector(`li[data-value="${option}"]`)
          ?.scrollIntoView({ behavior: 'instant', block: 'center' });
      },
    };
  });

  return (
    <ul ref={ulRef} className={styles.optionList}>
      {options.map((option) => (
        <li
          key={option}
          data-value={option}
          className={option === selectedOption ? styles.active : undefined}
          onClick={() => {
            setSelectedOption(option);
            onSelectionChange?.(option);
          }}
        >
          <button type="button">{option}</button>
        </li>
      ))}
    </ul>
  );
}
