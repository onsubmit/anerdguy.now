import { useRef, useState } from 'react';

import styles from './app.module.css';
import { ColorDialog } from './components/color-dialog';
import { ColorHelpDialog } from './components/color-help-dialog';
import { EditorOperations } from './components/editor-operation';
import { File } from './components/file';
import { Menu } from './components/menu';
import { Dialog } from './dialog';

export function App(): React.JSX.Element {
  const editorRef = useRef<EditorOperations>(null);
  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);

  return (
    <>
      <div className={styles.container}>
        <Menu editorRef={editorRef} setCurrentDialog={setCurrentDialog}></Menu>
        <File editorRef={editorRef}></File>
      </div>
      <ColorDialog
        open={currentDialog === 'color'}
        setCurrentDialog={setCurrentDialog}
      ></ColorDialog>
      <ColorHelpDialog
        open={currentDialog === 'color-help'}
        setCurrentDialog={setCurrentDialog}
      ></ColorHelpDialog>
    </>
  );
}
