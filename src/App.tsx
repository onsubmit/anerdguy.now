import { useRef } from 'react';

import styles from './app.module.css';
import { EditorOperations } from './components/editor-operation';
import { File } from './components/file';
import { Menu } from './components/menu';

export function App(): React.JSX.Element {
  const editorRef = useRef<EditorOperations>(null);

  return (
    <div className={styles.container}>
      <Menu editorRef={editorRef}></Menu>
      <File editorRef={editorRef}></File>
    </div>
  );
}
