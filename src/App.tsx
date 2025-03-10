import { useRef } from 'react';

import styles from './app.module.css';
import { ColorDialog } from './components/color-dialog';
import { EditorOperations } from './components/editor-operation';
import { File } from './components/file';
import { Menu } from './components/menu';

export function App(): React.JSX.Element {
  const editorRef = useRef<EditorOperations>(null);
  const colorDialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <div className={styles.container}>
        <Menu editorRef={editorRef} colorDialogRef={colorDialogRef}></Menu>
        <File editorRef={editorRef}></File>
      </div>
      <ColorDialog ref={colorDialogRef}></ColorDialog>
    </>
  );
}
