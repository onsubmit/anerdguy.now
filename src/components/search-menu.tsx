import { RefObject, useRef } from 'react';

import { useSubMenuFocusHandler } from '../hooks/useSubMenuFocusHandler';
import { FindDialogOperations } from './find-dialog';
import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

type SearchMenuParams = {
  disableReplace: boolean;
  findDialogRef: RefObject<FindDialogOperations | null>;
} & SubMenuParams;

export function SearchMenu({
  disableReplace,
  topMenuButton,
  openDialog,
  closeMenu,
  findDialogRef,
}: SearchMenuParams): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  useSubMenuFocusHandler(listRef);

  return (
    <div className={styles.subMenu}>
      <ul ref={listRef}>
        <li>
          <button
            type="button"
            onClick={() => openDialog({ type: 'find', toFocusOnClose: topMenuButton })}
          >
            Find...{'             '}Ctrl+F
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => {
              findDialogRef.current?.findAgain();
              closeMenu();
            }}
          >
            Repeat Last Find{'    '}F3
          </button>
        </li>
        <li>
          <button
            type="button"
            disabled={disableReplace}
            onClick={() => openDialog({ type: 'replace', toFocusOnClose: topMenuButton })}
          >
            Replace{'             '}Ctrl+R
          </button>
        </li>
      </ul>
    </div>
  );
}
