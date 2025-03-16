import { RefObject, useState } from 'react';

import { CursorPosition, Editor } from './editor';
import { EditorOperations } from './editor-operation';
import styles from './file.module.css';

type FileParams = {
  filename: string;
  contents: string;
  setContents: React.Dispatch<React.SetStateAction<string>>;
  editorMode: 'view' | 'edit';
  editorRef: RefObject<EditorOperations | null>;
};

export function File({
  filename,
  editorMode,
  contents,
  setContents,
  editorRef,
}: FileParams): React.JSX.Element {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ line: 1, column: 1 });

  return (
    <div className={styles.fileContainer}>
      <div className={styles.file}>
        <div className={styles.fileHeader}>
          <span className={styles.fileName}>{filename}</span>
        </div>
        <Editor
          ref={editorRef}
          mode={editorMode}
          contents={contents}
          setContents={setContents}
          onCursorPositionChange={setCursorPosition}
        ></Editor>
        <div className={styles.status}>
          <span>F1=Help</span>
          {editorMode === 'edit' ? (
            <div className={styles.cursor}>
              <span>Line:{cursorPosition.line}</span>
              <span>Col:{cursorPosition.column}</span>
            </div>
          ) : undefined}
        </div>
      </div>
    </div>
  );
}
