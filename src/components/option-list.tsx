import { useEffect, useRef } from 'react';

import styles from './option-list.module.css';

export type OptionListParams<T extends string> = {
  options: ReadonlyArray<T>;
  selectedOption: T;
  setSelectedOption: React.Dispatch<React.SetStateAction<T>>;
  onSelectionChange?: (color: T) => void;
};

export function OptionsList<T extends string>({
  options,
  selectedOption,
  setSelectedOption,
  onSelectionChange,
}: OptionListParams<T>): React.JSX.Element {
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    ulRef.current?.querySelector(`.${styles.active}`)?.scrollIntoView();
  }, []);

  return (
    <ul ref={ulRef} className={styles.optionList}>
      {options.map((option) => (
        <li
          key={option}
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
