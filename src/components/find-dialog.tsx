import { RefObject, useCallback, useImperativeHandle, useState } from 'react';

import { Dialog, DialogType } from './dialog';
import { DialogButtons } from './dialog-buttons';
import { EditorOperations, FindParams } from './editor-operation';
import styles from './find-dialog.module.css';

export type FindDialogOperations = {
  findAgain: () => void;
};

type FindDialogParams = {
  open: boolean;
  replace: boolean;
  closeDialog: () => void;
  setCurrentDialog: React.Dispatch<React.SetStateAction<DialogType | null>>;
  editorRef: RefObject<EditorOperations | null>;
  ref: RefObject<FindDialogOperations | null>;
};

export function FindDialog({
  open,
  replace,
  closeDialog,
  editorRef,
  ref,
}: FindDialogParams): React.JSX.Element {
  const [originalParams, setOriginalParams] = useState<FindParams>({
    value: '',
    matchWord: false,
    matchCase: false,
    replaceWith: replace ? '' : null,
  });
  const [pendingParams, setPendingParams] = useState<Partial<FindParams>>({});

  const cancelHandler = useCallback((): void => {
    setPendingParams({});
  }, []);

  useImperativeHandle(ref, () => {
    return {
      findAgain: (): void => {
        editorRef.current?.find({
          ...originalParams,
          replaceWith: null,
          replaceAll: undefined,
        });
      },
    };
  }, [editorRef, originalParams]);

  return (
    <Dialog open={open} title="Find" closeDialog={closeDialog} onCancel={cancelHandler}>
      <div className={styles.find}>
        <label>
          <span>Find What:{replace ? '   ' : ''}</span>
          <input
            type="text"
            autoFocus={true}
            value={pendingParams.value ?? originalParams.value}
            onChange={(e) => {
              const value = e.currentTarget.value;
              setPendingParams((x) => ({
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
                value={pendingParams.replaceWith ?? originalParams.replaceWith ?? ''}
                onChange={(e) => {
                  const replaceWith = e.currentTarget.value;
                  setPendingParams((x) => ({
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
            checked={pendingParams.matchWord ?? originalParams.matchWord}
            onChange={(e) => {
              const matchWord = e.currentTarget.checked;
              setPendingParams((x) => ({
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
            checked={pendingParams.matchCase ?? originalParams.matchCase}
            onChange={(e) => {
              const matchCase = e.currentTarget.checked;
              setPendingParams((x) => ({
                ...x,
                matchCase,
              }));
            }}
          ></input>
          <span>Match Case</span>
        </label>
      </div>
      <DialogButtons>
        {replace ? (
          <>
            <button
              type="button"
              className={styles.active}
              onClick={() => {
                closeDialog();
                const findParams = {
                  ...originalParams,
                  ...pendingParams,
                };
                setOriginalParams(findParams);
                editorRef.current?.find({
                  ...findParams,
                  replaceAll: false,
                });
              }}
            >
              Replace
            </button>
            <button
              type="button"
              className={styles.active}
              onClick={() => {
                const findParams = {
                  ...originalParams,
                  ...pendingParams,
                };
                setOriginalParams(findParams);
                editorRef.current?.find({
                  ...findParams,
                  replaceAll: true,
                });
              }}
            >
              Replace All
            </button>
          </>
        ) : (
          <button
            type="button"
            className={styles.active}
            onClick={() => {
              closeDialog();
              const findParams = {
                ...originalParams,
                ...pendingParams,
              };
              setOriginalParams(findParams);
              setPendingParams({});
              editorRef.current?.find({
                ...findParams,
                replaceWith: null,
                replaceAll: undefined,
              });
            }}
          >
            Find
          </button>
        )}
        <button
          type="button"
          className={styles.active}
          onClick={() => {
            cancelHandler();
            closeDialog();
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
