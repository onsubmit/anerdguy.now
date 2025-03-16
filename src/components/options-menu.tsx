import { useRef } from 'react';

import { useSubMenuFocusHandler } from '../hooks/useSubMenuFocusHandler';
import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

export function OptionsMenu({ topMenuButton, openDialog }: SubMenuParams): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  useSubMenuFocusHandler(listRef);

  return (
    <div className={styles.subMenu}>
      <ul ref={listRef}>
        <li>
          <button type="button">Settings...</button>
        </li>
        <li>
          <button type="button" onClick={() => openDialog('color', topMenuButton)}>
            Colors...
          </button>
        </li>
      </ul>
    </div>
  );
}
