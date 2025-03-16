import classNames from 'classnames';
import { RefObject, useCallback, useRef } from 'react';

import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { useSubMenuFocusHandler } from '../hooks/useSubMenuFocusHandler';
import { EditorMode } from './editor';
import { FindDialogOperations } from './find-dialog';
import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

type SearchMenuParams = {
  editorMode: EditorMode;
  disableReplace: boolean;
  findDialogRef: RefObject<FindDialogOperations | null>;
} & SubMenuParams;

export function SearchMenu({
  open,
  editorMode,
  disableReplace,
  topMenuButton,
  openDialog,
  closeMenu,
  findDialogRef,
  ref,
}: SearchMenuParams): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  const setFocusedIndex = useSubMenuFocusHandler({ ref, listRef, disable: !open });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === 'F3') {
        findDialogRef.current?.findAgain();
        e.preventDefault();
        return;
      }

      if (e.ctrlKey && ['f', 'r'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'r' && editorMode === 'view') {
          // Disable "Replace" in View mode
          return;
        }

        openDialog({ type: e.key === 'f' ? 'find' : 'replace' });
        return;
      }
    },
    [editorMode, findDialogRef, openDialog],
  );

  useKeyDownHandler(handleKeyDown);

  return (
    <div className={classNames(styles.subMenu, open ? styles.open : undefined)}>
      <ul ref={listRef}>
        <li>
          <button
            type="button"
            onFocus={() => setFocusedIndex(0)}
            onClick={() => openDialog({ type: 'find', toFocusOnClose: topMenuButton })}
          >
            Find...{'             '}Ctrl+F
          </button>
        </li>
        <li>
          <button
            type="button"
            onFocus={() => setFocusedIndex(1)}
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
            onFocus={() => setFocusedIndex(2)}
            onClick={() => openDialog({ type: 'replace', toFocusOnClose: topMenuButton })}
          >
            Replace{'             '}Ctrl+R
          </button>
        </li>
      </ul>
    </div>
  );
}
