import { RefObject, useImperativeHandle, useRef, useState } from 'react';

import styles from './file.module.css';

type CursorPosition = {
  line: number;
  column: number;
};

export type FileOperations = {
  focus: () => void;
  copy: () => void;
  cut: () => void;
};

type SelectionInfo = {
  selection: {
    textArea: HTMLTextAreaElement;
    selectedText: string;
    line: string;
    lineNumber: number;
    selectionStart: number;
    selectionEnd: number;
  };
  text: string;
  copiedFrom: 'selection' | 'line' | 'empty';
};

export function File({ ref }: { ref: RefObject<FileOperations | null> }): React.JSX.Element {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ line: 1, column: 1 });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const getLineAndColumnNumbers: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    const { value, selectionStart } = event.currentTarget;
    const lines = value.substring(0, selectionStart).split('\n');
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
    });
  };

  useImperativeHandle(ref, () => {
    const getTextArea = (): HTMLTextAreaElement => {
      const textArea = textAreaRef.current;
      if (!textArea) {
        throw new Error();
      }

      return textArea;
    };

    const getSelectionInfo = (): SelectionInfo['selection'] => {
      const textArea = getTextArea();
      const { selectionStart, selectionEnd, value } = textArea;

      const selectedText = value.substring(selectionStart, selectionEnd);
      const lines = value.substring(0, selectionStart).split('\n');
      const lineNumber = lines.length - 1;
      const line = lines[lineNumber];

      return { textArea, selectedText, line, lineNumber, selectionStart, selectionEnd };
    };

    const focus = (): void => textAreaRef.current?.focus();

    const copy = async (): Promise<SelectionInfo> => {
      const selection = getSelectionInfo();
      let text = selection?.selectedText;
      let copiedFrom: SelectionInfo['copiedFrom'] = 'selection';
      if (!text) {
        text = selection?.line;
        copiedFrom = 'line';

        if (!text) {
          text = '\n';
          copiedFrom = 'empty';
        }
      }

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        console.warn(`Could not copy text to clipboard: ${text}`);
      }

      return { selection, text, copiedFrom };
    };

    const cut = async (): Promise<void> => {
      const { selection, copiedFrom } = await copy();
      const { textArea } = selection;
      switch (copiedFrom) {
        case 'selection': {
          const { selectionStart, selectionEnd } = selection;
          textArea.value =
            textArea.value.substring(0, selectionStart) + textArea.value.substring(selectionEnd);
          textArea.selectionStart = textArea.selectionStart = selectionStart;
          break;
        }
        case 'line': {
          textArea.value = textArea.value
            .split('\n')
            .filter((_l, i) => i !== selection.lineNumber)
            .join('\n');
          break;
        }
      }
    };

    return {
      focus,
      copy,
      cut,
    };
  }, []);

  return (
    <div className={styles.fileContainer}>
      <div className={styles.file}>
        <div className={styles.fileHeader}>
          <span className={styles.fileName}>UNTITLED1</span>
        </div>
        <textarea
          ref={textAreaRef}
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
