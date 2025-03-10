import { useEffect, useRef } from 'react';

import styles from './option-list.module.css';

export type OptionListParams = {
  options: Array<string>;
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
};

export function OptionsList({
  options,
  selectedOption,
  setSelectedOption,
}: OptionListParams): React.JSX.Element {
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
          onClick={() => setSelectedOption(option)}
        >
          <button type="button">{option}</button>
        </li>
      ))}
    </ul>
  );
}
