import classNames from 'classnames';
import { useCallback, useRef } from 'react';

import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { useSubMenuFocusHandler } from '../hooks/useSubMenuFocusHandler';
import { EditorMode } from './editor';
import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

type FileMenuParams = {
  closeFile: () => void;
  saveFile: () => void;
  revertFile: () => void;
  disableClose: boolean;
  editorMode: EditorMode;
  toggleEditorMode: () => void;
  activeMenuIndex: number | null;
} & SubMenuParams;

export function FileMenu({
  open,
  closeFile,
  saveFile,
  revertFile,
  disableClose,
  editorMode,
  toggleEditorMode,
  closeMenu,
  activeMenuIndex,
  openDialog,
  ref,
}: FileMenuParams): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  const setFocusedIndex = useSubMenuFocusHandler({ ref, listRef, disable: !open });

  const saveHandler = useCallback(() => {
    saveFile();
    closeMenu();
  }, [closeMenu, saveFile]);

  const closeHandler = useCallback(() => {
    closeFile();
    closeMenu();
  }, [closeMenu, closeFile]);

  const revertHandler = useCallback(() => {
    revertFile();
    closeMenu();
  }, [closeMenu, revertFile]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        if (activeMenuIndex === null) {
          return toggleEditorMode();
        }
      }

      if (e.ctrlKey && (['n', 'o', 'r', 's'].includes(e.key) || (e.altKey && e.key === 'w'))) {
        e.preventDefault();
        switch (e.key) {
          case 'n':
            return;
          case 'o':
            return openDialog({ type: 'open-file' });
          case 'r':
            return revertHandler();
          case 's':
            return saveHandler();
          case 'w': {
            if (!disableClose) {
              return closeHandler();
            }
          }
        }
      }
    },
    [
      activeMenuIndex,
      closeHandler,
      disableClose,
      openDialog,
      revertHandler,
      saveHandler,
      toggleEditorMode,
    ],
  );

  useKeyDownHandler(handleKeyDown);

  return (
    <div className={classNames(styles.subMenu, open ? styles.open : undefined)}>
      <ul ref={listRef} role="menu">
        <li role="menuitem">
          <button
            type="button"
            onFocus={() => setFocusedIndex(0)}
            onClick={() => openDialog({ type: 'open-file' })}
          >
            {`Open...      Ctrl+O`}
          </button>
        </li>
        <li role="menuitem">
          <button type="button" onFocus={() => setFocusedIndex(1)} onClick={saveHandler}>
            {`Save         Ctrl+S`}
          </button>
        </li>
        <li role="menuitem">
          <button
            type="button"
            className={disableClose ? styles.disabled : undefined}
            aria-disabled={disableClose}
            onFocus={() => setFocusedIndex(2)}
            onClick={() => (disableClose ? undefined : closeHandler())}
          >
            {`Close        Ctrl+Alt+W`}
          </button>
          <hr />
        </li>
        <li role="menuitem">
          <button type="button" onFocus={() => setFocusedIndex(3)} onClick={revertHandler}>
            {`Revert       Ctrl+R`}
          </button>
        </li>
        <li role="menuitem">
          <button
            type="button"
            onFocus={() => setFocusedIndex(4)}
            onClick={() => {
              closeMenu();
              toggleEditorMode();
            }}
          >
            {editorMode === 'view' ? 'Edit         ESC' : 'Preview      ESC'}
          </button>
        </li>
      </ul>
    </div>
  );
}
