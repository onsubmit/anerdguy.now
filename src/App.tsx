import { useRef, useState } from 'react';

import styles from './app.module.css';
import { AboutDialog } from './components/about-dialog';
import { ColorDialog } from './components/color-dialog';
import { ColorHelpDialog } from './components/color-help-dialog';
import { DialogType } from './components/dialog';
import { EditorOperations } from './components/editor-operation';
import { File } from './components/file';
import { FindDialog, FindDialogOperations } from './components/find-dialog';
import { Menu } from './components/menu';

export function App(): React.JSX.Element {
  const editorRef = useRef<EditorOperations>(null);
  const findDialogRef = useRef<FindDialogOperations>(null);
  const toFocusOnDialogCloseRef = useRef<Array<HTMLElement>>([]);
  const [currentDialog, setCurrentDialog] = useState<DialogType | null>(null);

  const openDialog = (type: DialogType, toFocusOnClose?: HTMLElement | undefined): void => {
    setCurrentDialog(type);

    if (toFocusOnClose) {
      toFocusOnDialogCloseRef.current.push(toFocusOnClose);
    }
  };

  const closeDialog = (typeToOpen: DialogType | null = null): void => {
    setCurrentDialog(typeToOpen);

    if (toFocusOnDialogCloseRef.current.length) {
      toFocusOnDialogCloseRef.current.pop()?.focus();
    } else {
      setTimeout(() => editorRef.current?.focus());
    }
  };

  return (
    <>
      <div className={styles.container}>
        <Menu editorRef={editorRef} findDialogRef={findDialogRef} openDialog={openDialog}></Menu>
        <File editorRef={editorRef}></File>
      </div>
      <ColorDialog
        open={currentDialog === 'color'}
        openDialog={openDialog}
        closeDialog={closeDialog}
      ></ColorDialog>
      <ColorHelpDialog
        open={currentDialog === 'color-help'}
        closeDialog={closeDialog}
      ></ColorHelpDialog>
      <AboutDialog open={currentDialog === 'about'} closeDialog={closeDialog}></AboutDialog>
      <FindDialog
        ref={findDialogRef}
        editorRef={editorRef}
        replace={currentDialog === 'replace'}
        open={currentDialog === 'find' || currentDialog === 'replace'}
        closeDialog={closeDialog}
        setCurrentDialog={setCurrentDialog}
      ></FindDialog>
    </>
  );
}
