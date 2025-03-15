import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

export function SearchMenu({ topMenuButton, openDialog }: SubMenuParams): React.JSX.Element {
  return (
    <div className={styles.subMenu}>
      <ul>
        <li>
          <button type="button" onClick={() => openDialog('find', topMenuButton)}>
            Find...{'             '}Ctrl+F
          </button>
        </li>
        <li>
          <button type="button">Repeat Last Find{'    '}F3</button>
        </li>
        <li>
          <button type="button" onClick={() => openDialog('replace', topMenuButton)}>
            Replace{'             '}Ctrl+R
          </button>
        </li>
      </ul>
    </div>
  );
}
