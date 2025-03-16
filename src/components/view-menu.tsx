import classNames from 'classnames';
import { useRef } from 'react';

import { useSubMenuFocusHandler } from '../hooks/useSubMenuFocusHandler';
import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

export function ViewMenu({ open, ref }: SubMenuParams): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  const setFocusedIndex = useSubMenuFocusHandler({ ref, listRef, disable: !open });

  return (
    <div className={classNames(styles.subMenu, open ? styles.open : undefined)}>
      <ul ref={listRef}>
        <li>
          <button type="button" onFocus={() => setFocusedIndex(0)}>
            Split Window{'    '}Ctrl+F6
          </button>
        </li>
        <li>
          <button type="button" onFocus={() => setFocusedIndex(1)}>
            Size Window{'     '}Ctrl+F8
          </button>
        </li>
        <li>
          <button type="button" onFocus={() => setFocusedIndex(2)}>
            Close Window{'    '}Ctrl+F4
          </button>
        </li>
      </ul>
    </div>
  );
}
