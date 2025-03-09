import { RefObject, useImperativeHandle, useRef, useState } from 'react';

import styles from './file.module.css';

type CursorPosition = {
  line: number;
  column: number;
};

export type FileOperations = {
  focus: () => void;
  copy: () => void;
};

export function File({ ref }: { ref: RefObject<FileOperations | null> }): React.JSX.Element {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ line: 1, column: 1 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getLineAndColumnNumbers: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    const { value, selectionStart } = event.currentTarget;
    const lines = value.substring(0, selectionStart).split('\n');
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
    });
  };

  const getSelectedText = ():
    | { selectedText: string; line: string; selectionStart: number; selectionEnd: number }
    | undefined => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const { selectionStart, selectionEnd, value } = textarea;
    const selectedText = value.substring(selectionStart, selectionEnd);
    const lines = value.substring(0, selectionStart).split('\n');
    const line = lines[lines.length - 1];
    return { selectedText, line, selectionStart, selectionEnd };
  };

  useImperativeHandle(ref, () => {
    const focus = (): void => textareaRef.current?.focus();

    const copy = async (): Promise<void> => {
      const selection = getSelectedText();
      const text = selection?.selectedText || selection?.line || '\n';
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        console.warn(`Could not copy text to clipboard: ${text}`);
      }
    };

    return {
      focus,
      copy,
    };
  }, []);

  return (
    <div className={styles.fileContainer}>
      <div className={styles.file}>
        <div className={styles.fileHeader}>
          <span className={styles.fileName}>UNTITLED1</span>
        </div>
        <textarea
          ref={textareaRef}
          className={styles.fileContents}
          onKeyUp={getLineAndColumnNumbers}
        ></textarea>
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
