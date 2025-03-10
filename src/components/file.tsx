import { RefObject, useState } from 'react';

import { CursorPosition, Editor } from './editor';
import { EditorOperations } from './editor-operation';
import styles from './file.module.css';

type FileParams = {
  editorRef: RefObject<EditorOperations | null>;
};

export function File({ editorRef }: FileParams): React.JSX.Element {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ line: 1, column: 1 });

  return (
    <div className={styles.fileContainer}>
      <div className={styles.file}>
        <div className={styles.fileHeader}>
          <span className={styles.fileName}>UNTITLED1</span>
        </div>
        <Editor ref={editorRef} onCursorPositionChange={setCursorPosition}></Editor>
        <div className={styles.status}>
          <span>F1=Help</span>
          <div className={styles.cursor}>
            <span>Line:{cursorPosition.line}</span>
            <span>Col:{cursorPosition.column}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
