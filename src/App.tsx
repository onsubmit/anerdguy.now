import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import styles from './app.module.css';
import { AboutDialog } from './components/about-dialog';
import { ColorDialog } from './components/color-dialog';
import { ColorHelpDialog } from './components/color-help-dialog';
import { DialogType, OpenDialogArgs, OpenDialogEvent } from './components/dialog';
import { EditorMode } from './components/editor';
import { EditorOperations } from './components/editor-operation';
import { ErrorDialog, OpenErrorDialogParams } from './components/error-dialog';
import { EventsDialog } from './components/events-dialog';
import { File } from './components/file';
import { FindDialog, FindDialogOperations } from './components/find-dialog';
import { FindHelpDialog } from './components/find-help-dialog';
import { Menu } from './components/menu';
import { OpenFileDialog } from './components/open-file-dialog';
import { ReplaceHelpDialog } from './components/replace-help-dialog';
import { getRawFileContents, rawFileExists } from './importRawFiles';

export function App(): React.JSX.Element {
  const { file } = useParams();
  const navigate = useNavigate();
  const fileName = file && rawFileExists(file) ? file : 'index.html';

  const editorRef = useRef<EditorOperations>(null);
  const findDialogRef = useRef<FindDialogOperations>(null);
  const toFocusOnDialogCloseRef = useRef<Array<HTMLElement>>([]);

  const [editorMode, setEditorMode] = useState<EditorMode>('view');
  const [activeFileContents, setActiveFileContents] = useState('');
  const [currentDialog, setCurrentDialog] = useState<DialogType | null>(null);
  const [errorDialogArgs, setErrorDialogArgs] = useState<OpenErrorDialogParams>({
    message: '',
    detail: '',
  });

  const openFile = async (filename: string | undefined): Promise<void> => {
    navigate(`/${filename}`);
  };

  const loadFileContents = async (filename: string): Promise<void> => {
    const contents = await getRawFileContents(filename);
    setActiveFileContents(contents);
  };

  const openDialog = <T extends DialogType>({
    type,
    params,
    toFocusOnClose,
  }: OpenDialogArgs<T>): void => {
    if (type === 'error') {
      setErrorDialogArgs(
        params ?? {
          message: '',
          detail: '',
        },
      );
    }

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
    const openDialogFromEvent = (event: CustomEventInit<OpenDialogEvent<DialogType>>): void => {
      if (!event.detail) {
        return;
      }

      const { type } = event.detail;
      if (type === 'error') {
        openDialog({ type, params: event.detail.params });
      } else {
        openDialog({ type });
      }
    };

    const events = { 'toggle-edit': toggleEditorMode, 'open-dialog': openDialogFromEvent };
    Object.entries(events).forEach(([name, handler]) => document.addEventListener(name, handler));
    return (): void =>
      Object.entries(events).forEach(([name, handler]) =>
        document.removeEventListener(name, handler),
      );
  }, [toggleEditorMode]);

  useEffect(() => {
    loadFileContents(fileName);
  }, [fileName]);

  return (
    <>
      <div className={styles.container}>
        <Menu
          editorMode={editorMode}
          toggleEditorMode={toggleEditorMode}
          openDialog={openDialog}
          findDialogRef={findDialogRef}
          editorRef={editorRef}
        ></Menu>
        <File
          filename={fileName}
          contents={activeFileContents}
          setContents={setActiveFileContents}
          openDialog={openDialog}
          editorMode={editorMode}
          editorRef={editorRef}
        ></File>
      </div>
      <OpenFileDialog
        open={currentDialog === 'open-file'}
        openFile={openFile}
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
      <EventsDialog open={currentDialog === 'events'} closeDialog={closeDialog}></EventsDialog>
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
      <ErrorDialog
        open={currentDialog === 'error'}
        {...{ ...errorDialogArgs, closeDialog }}
      ></ErrorDialog>
    </>
  );
}
