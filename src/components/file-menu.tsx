import classNames from 'classnames';
import { useCallback, useRef } from 'react';

import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { useSubMenuFocusHandler } from '../hooks/useSubMenuFocusHandler';
import { EditorMode } from './editor';
import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

type FileMenuParams = {
  editorMode: EditorMode;
  toggleEditorMode: () => void;
  activeMenuIndex: number | null;
} & SubMenuParams;

export function FileMenu({
  open,
  editorMode,
  toggleEditorMode,
  closeMenu,
  activeMenuIndex,
  openDialog,
  ref,
}: FileMenuParams): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  const setFocusedIndex = useSubMenuFocusHandler({ ref, listRef, disable: !open });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        if (activeMenuIndex === null) {
          return toggleEditorMode();
        }
      }

      if (e.ctrlKey && ['n', 'o', 's', 'w'].includes(e.key)) {
        e.preventDefault();
        switch (e.key) {
          case 'n':
            return;
          case 'o':
            return openDialog({ type: 'open-file' });
          case 's':
            return;
          case 'w':
            return;
        }
      }
    },
    [activeMenuIndex, openDialog, toggleEditorMode],
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
          <button type="button" onFocus={() => setFocusedIndex(2)}>
            {`Save         Ctrl+S`}
          </button>
        </li>
        <li>
          <button type="button" onFocus={() => setFocusedIndex(3)}>
            {`Save As...   Ctrl+Alt+S`}
          </button>
        </li>
        <li>
          <button type="button" onFocus={() => setFocusedIndex(4)}>
            {`Close        Ctrl+W`}
          </button>
          <hr />
        </li>
        <li>
          <button
            type="button"
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
