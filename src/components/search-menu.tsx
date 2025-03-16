import { useRef } from 'react';

import { useSubMenuFocusHandler } from '../hooks/useSubMenuFocusHandler';
import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

export function SearchMenu({ topMenuButton, openDialog }: SubMenuParams): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  useSubMenuFocusHandler(listRef);

  return (
    <div className={styles.subMenu}>
      <ul ref={listRef}>
        <li>
          <button type="button" onClick={() => openDialog('find', topMenuButton)}>
            Find...{'             '}Ctrl+F
          </button>
        </li>
        <li>
          <button type="button">Repeat Last Find{'    '}F3</button>
        </li>
        <li>
          <button type="button" onClick={() => openDialog('replace', topMenuButton)}>
            Replace{'             '}Ctrl+R
          </button>
        </li>
      </ul>
    </div>
  );
}
