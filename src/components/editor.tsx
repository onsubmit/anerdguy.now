import React, { RefObject, useImperativeHandle, useRef } from 'react';

import styles from './editor.module.css';
import { EditorOperations, FindParams } from './editor-operation';

export type CursorPosition = {
  line: number;
  column: number;
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

type EditorParams = {
  onCursorPositionChange: (position: CursorPosition) => void;
  ref: RefObject<EditorOperations | null>;
};

export function Editor({ onCursorPositionChange, ref }: EditorParams): React.JSX.Element {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const getLineAndColumnNumbers: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    const { value, selectionStart } = event.currentTarget;
    const lines = value.substring(0, selectionStart).split('\n');
    onCursorPositionChange({
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
          textArea.selectionStart = textArea.selectionEnd = selectionStart;
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

    const paste = async (): Promise<void> => {
      let text = '';
      try {
        text = await navigator.clipboard.readText();
      } catch {
        console.warn('Could not read text from clipboard');
        return;
      }

      const textArea = getTextArea();
      const { selectionStart, selectionEnd } = textArea;

      textArea.value =
        textArea.value.substring(0, selectionStart) + text + textArea.value.substring(selectionEnd);
      textArea.selectionStart = textArea.selectionEnd = selectionEnd + text.length;
    };

    const deleteSelection = (): void => {
      const selection = getSelectionInfo();
      if (!selection.selectedText) {
        return;
      }

      const { textArea, selectionStart, selectionEnd } = selection;
      textArea.value =
        textArea.value.substring(0, selectionStart) + textArea.value.substring(selectionEnd);
      textArea.selectionStart = textArea.selectionEnd = selectionStart;
    };

    const find = ({ value, replaceWith, matchWord, matchCase }: FindParams): void => {
      const textArea = getTextArea();
      let currentText = textArea.value;
      if (!matchCase) {
        value = value.toLocaleLowerCase();
        currentText = currentText.toLocaleLowerCase();
      }

      const currentSelectedText = currentText.substring(
        textArea.selectionStart,
        textArea.selectionEnd,
      );

      let index = -1;
      if (matchWord) {
        const r = new RegExp(`\\b${value}\\b`, 'g');
        const matches = [...currentText.matchAll(r)];
        let startIndex = 0;
        for (startIndex = 0; startIndex < matches.length; startIndex++) {
          if (matches[startIndex].index >= textArea.selectionStart) {
            break;
          }
        }

        for (let i = 0; i < matches.length; i++) {
          const match = matches[(i + startIndex) % matches.length];
          if (
            matches.length > 1 &&
            match.index === textArea.selectionStart &&
            match.index + value.length === textArea.selectionEnd
          ) {
            continue;
          }

          index = match.index;
          break;
        }
      } else {
        const startIndex = textArea.selectionStart + (currentSelectedText === value ? 1 : 0);
        index = currentText.indexOf(value, startIndex);

        if (index < 0) {
          index = currentText.indexOf(value);
        }
      }

      if (index > -1) {
        setTimeout(() => {
          textArea.focus();
          textArea.setSelectionRange(index, index + value.length);
        });
      }
    };

    return {
      focus,
      copy,
      cut,
      paste,
      delete: deleteSelection,
      find,
    };
  }, []);

  return (
    <textarea
      ref={textAreaRef}
      className={styles.editor}
      onKeyUp={getLineAndColumnNumbers}
    ></textarea>
  );
}
