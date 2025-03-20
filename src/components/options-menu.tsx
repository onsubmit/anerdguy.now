import classNames from 'classnames';
import { useRef } from 'react';

import { useSubMenuFocusHandler } from '../hooks/useSubMenuFocusHandler';
import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

export function OptionsMenu({
  open,
  topMenuButton,
  openDialog,
  ref,
}: SubMenuParams): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  const setFocusedIndex = useSubMenuFocusHandler({ ref, listRef, disable: !open });

  return (
    <div className={classNames(styles.subMenu, open ? styles.open : undefined)}>
      <ul ref={listRef}>
        <li>
          <button
            type="button"
            onFocus={() => setFocusedIndex(0)}
            onClick={() => openDialog({ type: 'color', toFocusOnClose: topMenuButton })}
          >
            Colors...
          </button>
        </li>
        <li>
          <button
            type="button"
            onFocus={() => setFocusedIndex(1)}
            onClick={() => openDialog({ type: 'themes', toFocusOnClose: topMenuButton })}
          >
            Themes...
          </button>
        </li>
      </ul>
    </div>
  );
}
