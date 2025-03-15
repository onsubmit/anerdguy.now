import styles from './sub-menu.module.css';

export function EditMenu(): React.JSX.Element {
  return (
    <div className={styles.subMenu}>
      <ul>
        <li>
          <button type="button">Cut{'      '}Ctrl+X</button>
        </li>
        <li>
          <button type="button">Copy{'     '}Ctrl+C</button>
        </li>
        <li>
          <button type="button">Paste{'    '}Ctrl+V</button>
        </li>
        <li>
          <button type="button">Clear{'    '}Del</button>
        </li>
      </ul>
    </div>
  );
}
