import { useRef } from 'react';

import styles from './app.module.css';
import { File, FileOperations } from './components/file';
import { Menu } from './components/menu';

export function App(): React.JSX.Element {
  const fileRef = useRef<FileOperations>(null);

  return (
    <div className={styles.container}>
      <Menu fileRef={fileRef}></Menu>
      <File ref={fileRef}></File>
    </div>
  );
}
