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
  return (
    <div className={styles.subMenu}>
      <ul>
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
            {editorMode === 'view' ? 'Edit' : 'Preview'}
          </button>
        </li>
      </ul>
    </div>
  );
}
