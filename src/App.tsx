import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';

import styles from './app.module.css';
import { DialogType, OpenDialogArgs } from './components/dialog';
import { Dialogs, DialogsOperations } from './components/dialogs';
import { File } from './components/file';
import { FindDialogOperations } from './components/find-dialog';
import { Menu } from './components/menu';
import { EditorOperations } from './editor-operation';
import { fontCssUrls, FontName } from './fonts';
import { useAppSelector } from './hooks';
import { useCustomEvent } from './hooks/useCustomEvent';
import { getRawFileContents, rawFileExists } from './importRawFiles';
import {
  doesFileExistOnDisk,
  getCachedItem,
  getOpenCachedFiles,
  markCachedFile,
  setCachedItem,
  writeFileToDisk,
} from './localStorage';
import { selectDialog } from './slices/dialogSlice';
import { selectFont } from './slices/fontSlice';

const openCachedFiles = getOpenCachedFiles();

export function App(): React.JSX.Element {
  const { file } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileName = file ?? 'index.html';

  const currentDialog = useAppSelector(selectDialog);
  const selectedFont = useAppSelector(selectFont);

  const editorRef = useRef<EditorOperations>(null);
  const findDialogRef = useRef<FindDialogOperations>(null);
  const dialogsRef = useRef<DialogsOperations>(null);

  const [fontFamily, setFontFamily] = useState<FontName>(selectedFont);
  const [openFiles, setOpenFiles] = useState<Array<string>>(
    openCachedFiles.length ? [...new Set([...openCachedFiles, fileName])] : [fileName],
  );
  const [openFileContents, setOpenFileContents] = useState<Record<string, string>>({});

  const openDialog = useCallback(<T extends DialogType>(args: OpenDialogArgs<T>): void => {
    dialogsRef.current?.openDialog(args);
  }, []);

  const focusEditor = useCallback(() => {
    editorRef.current?.focus();
  }, []);

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

  useCustomEvent([{ name: 'toggle-edit', handler: toggleEditorMode }]);

  useEffect(() => {
    loadFileContents(fileName);
  }, [fileName, loadFileContents]);

  useEffect(() => {
    const link = document.head.querySelector(`link[data-font-name="${selectedFont}"`);
    if (link) {
      setFontFamily(selectedFont);
      return;
    }

    const cssUrl = fontCssUrls[selectedFont];

    const newLink = document.createElement('link');
    newLink.className = 'font-link';
    newLink.href = cssUrl;
    newLink.rel = 'stylesheet';
    newLink.setAttribute('data-font-name', selectedFont);
    newLink.onload = (): void => {
      setFontFamily(selectedFont);
      setCachedItem('font', selectedFont);
    };

    document.head.appendChild(newLink);
  }, [selectedFont]);

  return (
    <>
      <div className={styles.container} style={{ fontFamily }}>
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
          openDialog={openDialog}
          contents={openFileContents[fileName]}
          setContents={(contents: string) => {
            setOpenFileContents((x) => ({
              ...x,
              [fileName]: contents,
            }));
          }}
          editorMode={searchParams.get('edit') ? 'edit' : 'view'}
          editorRef={editorRef}
        ></File>
        <Dialogs
          ref={dialogsRef}
          editorRef={editorRef}
          openFile={openFile}
          focusEditor={focusEditor}
        ></Dialogs>
      </div>
    </>
  );
}
