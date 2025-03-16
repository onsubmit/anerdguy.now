import { useRef } from 'react';

import { useSubMenuFocusHandler } from '../hooks/useSubMenuFocusHandler';
import { EditorMode } from './editor';
import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

type EditMenuParams = {
  editorMode: EditorMode;
} & SubMenuParams;

export function EditMenu({ editorMode }: EditMenuParams): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  useSubMenuFocusHandler(listRef);

  return (
    <div className={styles.subMenu}>
      <ul ref={listRef}>
        <li>
          <button type="button" disabled={editorMode === 'view'}>
            Cut{'      '}Ctrl+X
          </button>
        </li>
        <li>
          <button type="button">Copy{'     '}Ctrl+C</button>
        </li>
        <li>
          <button type="button">Paste{'    '}Ctrl+V</button>
        </li>
        <li>
          <button type="button" disabled={editorMode === 'view'}>
            Clear{'    '}Del
          </button>
        </li>
      </ul>
    </div>
  );
}
