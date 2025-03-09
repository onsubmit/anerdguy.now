import styles from './app.module.css';
import { File } from './components/file';
import { Menu } from './components/menu';

export function App(): React.JSX.Element {
  return (
    <div className={styles.container}>
      <Menu></Menu>
      <File></File>
    </div>
  );
}
