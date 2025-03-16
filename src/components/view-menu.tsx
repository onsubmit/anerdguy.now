import { useRef } from 'react';

import { useSubMenuFocusHandler } from '../hooks/useSubMenuFocusHandler';
import styles from './sub-menu.module.css';

export function ViewMenu(): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  useSubMenuFocusHandler(listRef);

  return (
    <div className={styles.subMenu}>
      <ul ref={listRef}>
        <li>
          <button type="button">Split Window{'    '}Ctrl+F6</button>
        </li>
        <li>
          <button type="button">Size Window{'     '}Ctrl+F8</button>
        </li>
        <li>
          <button type="button">Close Window{'    '}Ctrl+F4</button>
        </li>
      </ul>
    </div>
  );
}
