import styles from './menu.module.css';

export function Menu(): React.JSX.Element {
  return (
    <div className={styles.menu}>
      <ul>
        <li>File</li>
        <li>Edit</li>
        <li>Search</li>
        <li>View</li>
        <li>Options</li>
        <li>Help</li>
      </ul>
    </div>
  );
}
