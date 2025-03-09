import { useState } from 'react';

import styles from './file.module.css';

type CursorPosition = {
  line: number;
  column: number;
};

export function File(): React.JSX.Element {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ line: 1, column: 1 });

  const getLineAndColumnNumbers: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    const { value, selectionStart } = event.currentTarget;
    const lines = value.substring(0, selectionStart).split('\n');
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
    });
  };

  return (
    <div className={styles.fileContainer}>
      <div className={styles.file}>
        <div className={styles.fileHeader}>
          <span className={styles.fileName}>UNTITLED1</span>
        </div>
        <textarea className={styles.fileContents} onKeyUp={getLineAndColumnNumbers}></textarea>
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
