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
  editorMode: EditorMode;
  toggleEditorMode: () => void;
  activeMenuIndex: number | null;
} & SubMenuParams;

export function FileMenu({
  open,
  closeFile,
  saveFile,
  revertFile,
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

      if (e.ctrlKey && ['n', 'o', 'r', 's', 'w'].includes(e.key)) {
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
          case 'w':
            return closeHandler();
        }
      }
    },
    [activeMenuIndex, closeHandler, openDialog, revertHandler, saveHandler, toggleEditorMode],
  );

  useKeyDownHandler(handleKeyDown);

  return (
    <div className={classNames(styles.subMenu, open ? styles.open : undefined)}>
      <ul ref={listRef}>
        <li>
          <button type="button" onFocus={() => setFocusedIndex(0)}>
            {`New          Ctrl+N`}
          </button>
        </li>
        <li>
          <button
            type="button"
            onFocus={() => setFocusedIndex(1)}
            onClick={() => openDialog({ type: 'open-file' })}
          >
            {`Open...      Ctrl+O`}
          </button>
        </li>
        <li>
          <button type="button" onFocus={() => setFocusedIndex(2)} onClick={saveHandler}>
            {`Save         Ctrl+S`}
          </button>
        </li>
        <li>
          <button type="button" onFocus={() => setFocusedIndex(3)}>
            {`Save As...   Ctrl+Alt+S`}
          </button>
        </li>
        <li>
          <button type="button" onFocus={() => setFocusedIndex(4)} onClick={closeHandler}>
            {`Close        Ctrl+W`}
          </button>
          <hr />
        </li>
        <li>
          <button type="button" onFocus={() => setFocusedIndex(5)} onClick={revertHandler}>
            {`Revert       Ctrl+R`}
          </button>
        </li>
        <li>
          <button
            type="button"
            onFocus={() => setFocusedIndex(6)}
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
