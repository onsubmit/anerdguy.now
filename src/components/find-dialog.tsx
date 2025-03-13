import { RefObject, useState } from 'react';

import { Dialog, DialogType } from './dialog';
import { DialogButtons } from './dialog-buttons';
import { EditorOperations, FindParams } from './editor-operation';
import styles from './find-dialog.module.css';

type FindDialogParams = {
  open: boolean;
  replace: boolean;
  setCurrentDialog: React.Dispatch<React.SetStateAction<DialogType | null>>;
  editorRef: RefObject<EditorOperations | null>;
};

export function FindDialog({
  open,
  replace,
  setCurrentDialog,
  editorRef,
}: FindDialogParams): React.JSX.Element {
  const [params, setParams] = useState<FindParams>({
    value: '',
    replaceWith: replace ? '' : null,
    matchWord: false,
    matchCase: false,
  });

  return (
    <Dialog open={open} title="Find">
      <div className={styles.find}>
        <label>
          <span>Find What:{replace ? '   ' : ''}</span>
          <input
            type="text"
            autoFocus={true}
            onChange={(e) => {
              const value = e.currentTarget.value;
              setParams((x) => ({
                ...x,
                value,
              }));
            }}
          ></input>
        </label>
        {replace ? (
          <>
            <label>
              <span>Replace With:</span>
              <input
                type="text"
                onChange={(e) => {
                  const replaceWith = e.currentTarget.value;
                  setParams((x) => ({
                    ...x,
                    replaceWith,
                  }));
                }}
              ></input>
            </label>
          </>
        ) : undefined}
        <label>
          <input
            type="checkbox"
            onChange={(e) => {
              const matchWord = e.currentTarget.checked;
              setParams((x) => ({
                ...x,
                matchWord,
              }));
            }}
          ></input>
          <span>Match Whole Word Only</span>
        </label>
        <label>
          <input
            type="checkbox"
            onChange={(e) => {
              const matchCase = e.currentTarget.checked;
              setParams((x) => ({
                ...x,
                matchCase,
              }));
            }}
          ></input>
          <span>Match Case</span>
        </label>
      </div>
      <DialogButtons>
        <button
          type="button"
          className={styles.active}
          onClick={() => {
            setCurrentDialog(null);
            editorRef.current?.find(params);
          }}
        >
          Find
        </button>
        <button
          type="button"
          className={styles.active}
          onClick={() => {
            setCurrentDialog(null);
          }}
        >
          Cancel
        </button>
        <button type="button" className={styles.active}>
          Help
        </button>
      </DialogButtons>
    </Dialog>
  );
}
