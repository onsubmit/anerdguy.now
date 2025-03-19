import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';

import styles from './app.module.css';
import { AboutDialog } from './components/about-dialog';
import { ColorDialog } from './components/color-dialog';
import { ColorHelpDialog } from './components/color-help-dialog';
import { DialogType, OpenDialogArgs, OpenDialogEvent } from './components/dialog';
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
import {
  doesFileExistOnDisk,
  getCachedItem,
  getOpenCachedFiles,
  markCachedFile,
  writeFileToDisk,
} from './localStorage';

const openCachedFiles = getOpenCachedFiles();

export function App(): React.JSX.Element {
  const { file } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileName = file ?? 'index.html';

  const editorRef = useRef<EditorOperations>(null);
  const findDialogRef = useRef<FindDialogOperations>(null);
  const toFocusOnDialogCloseRef = useRef<Array<HTMLElement>>([]);

  const [openFiles, setOpenFiles] = useState<Array<string>>(
    openCachedFiles.length ? [...new Set([...openCachedFiles, fileName])] : [fileName],
  );
  const [openFileContents, setOpenFileContents] = useState<Record<string, string>>({});
  const [currentDialog, setCurrentDialog] = useState<DialogType | null>(null);
  const [errorDialogArgs, setErrorDialogArgs] = useState<OpenErrorDialogParams>({
    message: '',
    detail: '',
  });

  const openFile = async (filename: string): Promise<void> => {
    if (!openFiles.includes(filename)) {
      setOpenFiles((x) => [...x, filename]);
    }
    markCachedFile(filename, 'isOpen', true);
    navigate(`/${filename}?${searchParams}`);
  };

  const saveFile = (): void => {
    writeFileToDisk(fileName, openFileContents[fileName]);
  };

  const closeFile = (): void => {
    const index = openFiles.indexOf(fileName);
    const newOpenedFiles = openFiles.toSpliced(index, 1);
    const newOpenFileContents = {
      ...openFileContents,
    };
    delete newOpenFileContents[fileName];
    setOpenFileContents(newOpenFileContents);
    markCachedFile(fileName, 'isOpen', false);

    setOpenFiles(newOpenedFiles);
    navigate(`/${newOpenedFiles[index] ?? newOpenedFiles[index - 1]}?${searchParams}`);
  };

  const revertFile = async (): Promise<void> => {
    const contents = rawFileExists(fileName)
      ? await getRawFileContents(fileName)
      : (getCachedItem('files')?.[fileName]?.contentsOnDisk ?? '');
    setOpenFileContents((x) => ({
      ...x,
      [fileName]: contents,
    }));
    writeFileToDisk(fileName, contents);
  };

  const loadFileContents = useCallback(async (filename: string): Promise<void> => {
    const files = getCachedItem('files');

    const contents =
      files?.[filename]?.contentsOnDisk ??
      (rawFileExists(filename) ? await getRawFileContents(filename) : '');

    if (doesFileExistOnDisk(filename)) {
      markCachedFile(filename, 'isOpen', true);
    } else {
      writeFileToDisk(filename, contents);
    }

    setOpenFileContents((x) => ({
      ...x,
      [filename]: contents,
    }));
  }, []);

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
        if (searchParams.get('edit')) {
          setTimeout(() => editorRef.current?.focus());
        }
      }
    });
  };

  const toggleEditorMode = useCallback((): void => {
    if (currentDialog !== null) {
      return;
    }

    if (searchParams.get('edit')) {
      searchParams.delete('edit');
    } else {
      searchParams.set('edit', '1');
    }
    setSearchParams(searchParams);
  }, [currentDialog, searchParams, setSearchParams]);

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
  }, [fileName, loadFileContents]);

  return (
    <>
      <div className={styles.container}>
        <Menu
          editorMode={searchParams.get('edit') ? 'edit' : 'view'}
          toggleEditorMode={toggleEditorMode}
          openFile={openFile}
          closeFile={closeFile}
          saveFile={saveFile}
          revertFile={revertFile}
          openFiles={openFiles}
          openDialog={openDialog}
          findDialogRef={findDialogRef}
          editorRef={editorRef}
        ></Menu>
        <File
          filename={fileName}
          contents={openFileContents[fileName]}
          setContents={(contents: string) => {
            setOpenFileContents((x) => ({
              ...x,
              [fileName]: contents,
            }));
          }}
          openDialog={openDialog}
          editorMode={searchParams.get('edit') ? 'edit' : 'view'}
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
