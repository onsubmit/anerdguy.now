import { useRef } from 'react';

import { useSubMenuFocusHandler } from '../hooks/useSubMenuFocusHandler';
import { EditorMode } from './editor';
import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

type FileMenuParams = {
  editorMode: EditorMode;
  toggleEditorMode: () => void;
} & SubMenuParams;

export function FileMenu({
  editorMode,
  toggleEditorMode,
  closeMenu,
}: FileMenuParams): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  useSubMenuFocusHandler(listRef);

  return (
    <div className={styles.subMenu}>
      <ul ref={listRef}>
        <li>
          <button type="button">New</button>
        </li>
        <li>
          <button type="button">Open...</button>
        </li>
        <li>
          <button type="button">Save</button>
        </li>
        <li>
          <button type="button">Save As...</button>
        </li>
        <li>
          <button type="button">Close</button>
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
