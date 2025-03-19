import classNames from 'classnames';
import { useCallback, useRef } from 'react';

import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { useSubMenuFocusHandler } from '../hooks/useSubMenuFocusHandler';
import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

export function HelpMenu({
  open,
  topMenuButton,
  openDialog,
  ref,
}: SubMenuParams): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  const setFocusedIndex = useSubMenuFocusHandler({ ref, listRef, disable: !open });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === 'F1') {
        e.preventDefault();
        openDialog({
          type: 'about',
          toFocusOnClose:
            document.activeElement instanceof HTMLElement ? document.activeElement : topMenuButton,
        });
        return;
      }
    },
    [openDialog, topMenuButton],
  );

  useKeyDownHandler(handleKeyDown);

  return (
    <div className={classNames(styles.subMenu, open ? styles.open : undefined)}>
      <ul ref={listRef}>
        <li>
          <button
            type="button"
            onFocus={() => setFocusedIndex(0)}
            onClick={() => openDialog({ type: 'events', toFocusOnClose: topMenuButton })}
          >
            Events...
          </button>
        </li>
        <li>
          <button
            type="button"
            onFocus={() => setFocusedIndex(1)}
            onClick={() => openDialog({ type: 'about', toFocusOnClose: topMenuButton })}
          >
            {`About...    F1`}
          </button>
        </li>
      </ul>
    </div>
  );
}
