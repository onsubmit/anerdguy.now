import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

export function HelpMenu({ topMenuButton, openDialog }: SubMenuParams): React.JSX.Element {
  return (
    <div className={styles.subMenu}>
      <ul>
        <li>
          <button type="button">Commands...</button>
        </li>
        <li>
          <button type="button" onClick={() => openDialog('about', topMenuButton)}>
            About...
          </button>
        </li>
      </ul>
    </div>
  );
}
