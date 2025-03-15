import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

export function OptionsMenu({ topMenuButton, openDialog }: SubMenuParams): React.JSX.Element {
  return (
    <div className={styles.subMenu}>
      <ul>
        <li>
          <button type="button">Settings...</button>
        </li>
        <li>
          <button type="button" onClick={() => openDialog('color', topMenuButton)}>
            Colors...
          </button>
        </li>
      </ul>
    </div>
  );
}
