import classNames from 'classnames';
import { RefObject, useRef } from 'react';

import { EditorOperations } from '../editor-operation';
import { useSubMenuFocusHandler } from '../hooks/useSubMenuFocusHandler';
import { EditorMode } from './editor';
import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

type EditMenuParams = {
  editorMode: EditorMode;
  editorRef: RefObject<EditorOperations | null>;
} & SubMenuParams;

export function EditMenu({
  open,
  closeMenu,
  editorMode,
  editorRef,
  openDialog,
  ref,
}: EditMenuParams): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  const setFocusedIndex = useSubMenuFocusHandler({ ref, listRef, disable: !open });
  const disabledInViewMode = editorMode === 'view';

  return (
    <div className={classNames(styles.subMenu, open ? styles.open : undefined)}>
      <ul ref={listRef} role="menu">
        <li role="menuitem">
          <button
            type="button"
            className={disabledInViewMode ? styles.disabled : undefined}
            aria-disabled={disabledInViewMode}
            onFocus={() => setFocusedIndex(0)}
            onClick={() => {
              if (disabledInViewMode) {
                return;
              }

              closeMenu();
              editorRef.current?.cut();
            }}
          >
            Cut{'      '}Ctrl+X
          </button>
        </li>
        <li role="menuitem">
          <button
            type="button"
            onFocus={() => setFocusedIndex(1)}
            onClick={async () => {
              closeMenu();
              if (editorMode === 'edit') {
                editorRef.current?.copy();
              } else {
                const selection = getSelection()?.toString();
                if (selection) {
                  try {
                    await navigator.clipboard.writeText(selection);
                  } catch (e) {
                    const detail = e instanceof Error ? e.message : `${e}`;
                    openDialog({
                      type: 'error',
                      params: { message: 'Unable to access clipboard.', detail },
                      toFocusOnClose: listRef.current
                    });
                  }
                }
              }
            }}
          >
            Copy{'     '}Ctrl+C
          </button>
        </li>
        <li role="menuitem">
          <button
            type="button"
            className={disabledInViewMode ? styles.disabled : undefined}
            aria-disabled={disabledInViewMode}
            onFocus={() => setFocusedIndex(2)}
            onClick={() => {
              if (disabledInViewMode) {
                return;
              }

              closeMenu();
              editorRef.current?.paste();
            }}
          >
            Paste{'    '}Ctrl+V
          </button>
        </li>
        <li role="menuitem">
          <button
            type="button"
            className={disabledInViewMode ? styles.disabled : undefined}
            aria-disabled={disabledInViewMode}
            onFocus={() => setFocusedIndex(3)}
            onClick={() => {
              if (disabledInViewMode) {
                return;
              }
              closeMenu();
              editorRef.current?.delete();
            }}
          >
            Clear{'    '}Del
          </button>
        </li>
      </ul>
    </div>
  );
}
