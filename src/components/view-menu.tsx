import styles from './sub-menu.module.css';

export function ViewMenu(): React.JSX.Element {
  return (
    <div className={styles.subMenu}>
      <ul>
        <li>
          <button type="button">Split Window{'    '}Ctrl+F6</button>
        </li>
        <li>
          <button type="button">Size Window{'     '}Ctrl+F8</button>
        </li>
        <li>
          <button type="button">Close Window{'    '}Ctrl+F4</button>
        </li>
      </ul>
    </div>
  );
}
