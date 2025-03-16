import classNames from 'classnames';
import { RefObject, useRef } from 'react';

import { useSubMenuFocusHandler } from '../hooks/useSubMenuFocusHandler';
import { EditorMode } from './editor';
import { EditorOperations } from './editor-operation';
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
}: EditMenuParams): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  useSubMenuFocusHandler(listRef);

  return (
    <div className={classNames(styles.subMenu, open ? styles.open : undefined)}>
      <ul ref={listRef}>
        <li>
          <button
            type="button"
            disabled={editorMode === 'view'}
            onClick={() => {
              closeMenu();
              editorRef.current?.cut();
            }}
          >
            Cut{'      '}Ctrl+X
          </button>
        </li>
        <li>
          <button
            type="button"
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
                    });
                  }
                }
              }
            }}
          >
            Copy{'     '}Ctrl+C
          </button>
        </li>
        <li>
          <button
            type="button"
            disabled={editorMode === 'view'}
            onClick={() => {
              closeMenu();
              editorRef.current?.paste();
            }}
          >
            Paste{'    '}Ctrl+V
          </button>
        </li>
        <li>
          <button
            type="button"
            disabled={editorMode === 'view'}
            onClick={() => {
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
