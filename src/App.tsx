import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './app.module.css';
import { AboutDialog } from './components/about-dialog';
import { ColorDialog } from './components/color-dialog';
import { ColorHelpDialog } from './components/color-help-dialog';
import { DialogType, OpenDialogEvent } from './components/dialog';
import { EditorMode } from './components/editor';
import { EditorOperations } from './components/editor-operation';
import { File } from './components/file';
import { FindDialog, FindDialogOperations } from './components/find-dialog';
import { FindHelpDialog } from './components/find-help-dialog';
import { Menu2 } from './components/menu2';
import { OpenFileDialog } from './components/open-file-dialog';
import { ReplaceHelpDialog } from './components/replace-help-dialog';
import index from './inc/index.html?raw';

export function App(): React.JSX.Element {
  const editorRef = useRef<EditorOperations>(null);
  const findDialogRef = useRef<FindDialogOperations>(null);
  const toFocusOnDialogCloseRef = useRef<Array<HTMLElement>>([]);
  const [editorMode, setEditorMode] = useState<EditorMode>('view');
  const [activeFilename, _setActiveFilename] = useState('anerdguy.now');
  const [activeFileContents, setActiveFileContents] = useState(index);
  const [currentDialog, setCurrentDialog] = useState<DialogType | null>(null);

  const openDialog = (type: DialogType, toFocusOnClose?: HTMLElement | null): void => {
    setCurrentDialog(type);

    if (toFocusOnClose) {
      toFocusOnDialogCloseRef.current.push(toFocusOnClose);
    }
  };

  const closeDialog = (typeToOpen: DialogType | null = null): void => {
    setCurrentDialog(typeToOpen);

    setTimeout(() => {
      if (toFocusOnDialogCloseRef.current.length) {
        toFocusOnDialogCloseRef.current.pop()?.focus();
      } else {
        if (editorMode === 'edit') {
          setTimeout(() => editorRef.current?.focus());
        }
      }
    });
  };

  const toggleEditorMode = useCallback((): void => {
    if (currentDialog !== null) {
      return;
    }

    setEditorMode((mode) => (mode === 'edit' ? 'view' : 'edit'));
  }, [currentDialog]);

  useEffect(() => {
    const openDialogFromEvent = (event: CustomEventInit<OpenDialogEvent>): void => {
      if (!event.detail) {
        return;
      }

      openDialog(event.detail.type);
    };

    const events = { 'toggle-edit': toggleEditorMode, 'open-dialog': openDialogFromEvent };
    Object.entries(events).forEach(([name, handler]) => document.addEventListener(name, handler));
    return (): void =>
      Object.entries(events).forEach(([name, handler]) =>
        document.removeEventListener(name, handler),
      );
  }, [toggleEditorMode]);

  return (
    <>
      <div className={styles.container}>
        {/* <Menu
          toggleEditorMode={toggleEditorMode}
          editorRef={editorRef}
          findDialogRef={findDialogRef}
          openDialog={openDialog}
        ></Menu> */}
        <Menu2
          editorMode={editorMode}
          toggleEditorMode={toggleEditorMode}
          openDialog={openDialog}
          findDialogRef={findDialogRef}
        ></Menu2>
        <File
          filename={activeFilename}
          contents={activeFileContents}
          setContents={setActiveFileContents}
          editorMode={editorMode}
          editorRef={editorRef}
        ></File>
      </div>
      <OpenFileDialog
        open={currentDialog === 'open-file'}
        openDialog={openDialog}
        closeDialog={closeDialog}
      ></OpenFileDialog>
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
        openDialog={openDialog}
        closeDialog={closeDialog}
        setCurrentDialog={setCurrentDialog}
      ></FindDialog>
      <FindHelpDialog
        open={currentDialog === 'find-help'}
        closeDialog={closeDialog}
      ></FindHelpDialog>
      <ReplaceHelpDialog
        open={currentDialog === 'replace-help'}
        closeDialog={closeDialog}
      ></ReplaceHelpDialog>
    </>
  );
}
