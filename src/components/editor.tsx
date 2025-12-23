import React, { RefObject, useImperativeHandle, useLayoutEffect, useRef } from 'react';

import { EditorOperations, FindParams } from '../editor-operation';
import { DialogType, OpenDialogArgs } from './dialog';
import styles from './editor.module.css';

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

export type EditorMode = 'view' | 'edit';

type EditorParams = {
  contents: string;
  setContents: (contents: string) => void;
  mode: EditorMode;
  onCursorPositionChange: (position: CursorPosition) => void;
  openDialog: <T extends DialogType>(args: OpenDialogArgs<T>) => void;
  ref: RefObject<EditorOperations | null>;
};

export function Editor({
  contents,
  setContents,
  mode,
  onCursorPositionChange,
  openDialog,
  ref,
}: EditorParams): React.JSX.Element {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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
          setContents(contents.substring(0, selectionStart) + contents.substring(selectionEnd));
          textArea.selectionStart = textArea.selectionEnd = selectionStart;
          break;
        }
        case 'line': {
          setContents(
            contents
              .split('\n')
              .filter((_l, i) => i !== selection.lineNumber)
              .join('\n'),
          );

          break;
        }
      }
    };

    const paste = async (): Promise<void> => {
      let text = '';
      try {
        text = await navigator.clipboard.readText();
      } catch (e) {
        const detail = e instanceof Error ? e.message : `${e}`;
        openDialog({
          type: 'error',
          params: { message: 'Unable to access clipboard.', detail },
          toFocusOnClose: textAreaRef.current,
        });
        return;
      }

      const textArea = getTextArea();
      const { selectionStart, selectionEnd } = textArea;

      setContents(contents.substring(0, selectionStart) + text + contents.substring(selectionEnd));
      textArea.selectionStart = textArea.selectionEnd = selectionEnd + text.length;
    };

    const deleteSelection = (): void => {
      const selection = getSelectionInfo();
      if (!selection.selectedText) {
        return;
      }

      const { textArea, selectionStart, selectionEnd } = selection;
      setContents(contents.substring(0, selectionStart) + contents.substring(selectionEnd));
      textArea.selectionStart = textArea.selectionEnd = selectionStart;
    };

    const getTextNodes = (): Array<Node> => {
      const preview = previewRef.current;
      if (!preview) return [];

      const treeWalker = document.createTreeWalker(preview, NodeFilter.SHOW_TEXT);
      const allTextNodes: Array<Node> = [];
      let currentNode = treeWalker.nextNode();
      while (currentNode) {
        allTextNodes.push(currentNode);
        currentNode = treeWalker.nextNode();
      }

      return allTextNodes;
    };

    const getMatchIndices = (text: string, searchValue: string): Array<number> => {
      const indices: Array<number> = [];

      let startPos = 0;
      while (startPos < text.length) {
        const index = text.indexOf(searchValue, startPos);
        if (index === -1) break;
        indices.push(index);
        startPos = index + searchValue.length;
      }

      return indices;
    };

    const createRange = (el: Node, index: number, length: number): Range => {
      const range = new Range();
      range.setStart(el, index);
      range.setEnd(el, index + length);
      return range;
    };

    const find = ({
      value,
      matchWord,
      matchCase,
      replaceWith,
      replaceAll,
    }: FindParams & { replaceAll?: boolean }): void => {
      if (mode === 'view') {
        setTimeout(() => {
          CSS.highlights.clear();

          if (!matchCase) {
            value = value.toLocaleLowerCase();
          }

          const ranges = getTextNodes()
            .map((node) => ({
              node,
              text: (matchCase ? node.textContent : node.textContent?.toLowerCase()) ?? '',
            }))
            .flatMap(({ node, text }) =>
              getMatchIndices(text, value).map((index) => createRange(node, index, value.length)),
            );

          const highlight = new Highlight(...ranges);
          CSS.highlights.set('search-results', highlight);
        });

        return;
      }

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
        const r = new RegExp(`\\b${value}\\b`, matchCase ? 'g' : 'gi');
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
          if (replaceWith !== null) {
            if (replaceAll) {
              const r = new RegExp(matchWord ? `\\b${value}\\b` : value, matchCase ? 'g' : 'gi');
              setContents(contents.replace(r, replaceWith));
            } else {
              setContents(
                contents.slice(0, index) + replaceWith + contents.slice(index + value.length),
              );
            }
          }

          textArea.focus();
          textArea.setSelectionRange(index, index + (replaceWith ?? value).length);
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
      replace: find,
    };
  }, [contents, mode, openDialog, setContents]);

  useLayoutEffect(() => {
    if (!previewRef.current || contents === undefined) {
      return;
    }

    const range = document.createRange();
    range.selectNode(previewRef.current);
    const documentFragment = range.createContextualFragment(contents);

    // Inject the markup, triggering a re-run!
    previewRef.current.innerHTML = '';
    previewRef.current.append(documentFragment);
  }, [contents, mode]);

  return mode === 'edit' ? (
    <textarea
      ref={textAreaRef}
      className={styles.editor}
      spellCheck={false}
      onKeyUp={getLineAndColumnNumbers}
      value={contents}
      onChange={(e) => setContents(e.currentTarget.value)}
    ></textarea>
  ) : (
    <div
      ref={previewRef}
      className={styles.editor}
      dangerouslySetInnerHTML={{ __html: contents }}
    ></div>
  );
}
