import { useRef, useState } from 'react';

import styles from './app.module.css';
import { AboutDialog } from './components/about-dialog';
import { ColorDialog } from './components/color-dialog';
import { ColorHelpDialog } from './components/color-help-dialog';
import { DialogType } from './components/dialog';
import { EditorOperations } from './components/editor-operation';
import { File } from './components/file';
import { FindDialog } from './components/find-dialog';
import { Menu } from './components/menu';

export function App(): React.JSX.Element {
  const editorRef = useRef<EditorOperations>(null);
  const [currentDialog, setCurrentDialog] = useState<DialogType | null>(null);

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
      <AboutDialog
        open={currentDialog === 'about'}
        setCurrentDialog={setCurrentDialog}
      ></AboutDialog>
      <FindDialog
        replace={false}
        open={currentDialog === 'find'}
        setCurrentDialog={setCurrentDialog}
      ></FindDialog>
    </>
  );
}
