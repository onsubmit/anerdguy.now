import classNames from 'classnames';
import { useRef } from 'react';

import { useSubMenuFocusHandler } from '../hooks/useSubMenuFocusHandler';
import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

export function OptionsMenu({ open, topMenuButton, openDialog }: SubMenuParams): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  useSubMenuFocusHandler(listRef);

  return (
    <div className={classNames(styles.subMenu, open ? styles.open : undefined)}>
      <ul ref={listRef}>
        <li>
          <button type="button">Settings...</button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => openDialog({ type: 'color', toFocusOnClose: topMenuButton })}
          >
            Colors...
          </button>
        </li>
      </ul>
    </div>
  );
}
