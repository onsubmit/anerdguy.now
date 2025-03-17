import { RefObject, useCallback, useImperativeHandle, useState } from 'react';

import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { Dialog, DialogType, OpenDialogArgs } from './dialog';
import { DialogButtons } from './dialog-buttons';
import { EditorOperations, FindParams } from './editor-operation';
import styles from './find-dialog.module.css';

export type FindDialogOperations = {
  findAgain: () => void;
};

type FindDialogParams = {
  open: boolean;
  replace: boolean;
  openDialog: <T extends DialogType>({ type, toFocusOnClose }: OpenDialogArgs<T>) => void;
  closeDialog: () => void;
  setCurrentDialog: React.Dispatch<React.SetStateAction<DialogType | null>>;
  editorRef: RefObject<EditorOperations | null>;
  ref: RefObject<FindDialogOperations | null>;
};

export function FindDialog({
  open,
  replace,
  openDialog,
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

  const okayHandler = useCallback(() => {
    closeDialog();
    const findParams = {
      ...originalParams,
      ...pendingParams,
    };
    setOriginalParams(findParams);

    if (replace) {
      editorRef.current?.find({
        ...findParams,
        replaceAll: false,
      });
    } else {
      setPendingParams({});
      editorRef.current?.find({
        ...findParams,
        replaceWith: null,
        replaceAll: undefined,
      });
    }
  }, [closeDialog, editorRef, originalParams, pendingParams, replace]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (!open) {
        return;
      }

      if (e.key === 'Enter') {
        okayHandler();
        e.preventDefault();
      }
    },
    [okayHandler, open],
  );

  useKeyDownHandler(handleKeyDown);

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
    <Dialog
      open={open}
      title={replace ? 'Replace' : 'Find'}
      closeDialog={closeDialog}
      onCancel={cancelHandler}
    >
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
            <button type="button" onClick={okayHandler}>
              Replace
            </button>
            <button
              type="button"
              onClick={() => {
                closeDialog();
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
          <button type="button" onClick={okayHandler}>
            Find
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            cancelHandler();
            closeDialog();
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={(e) =>
            openDialog({
              type: replace ? 'replace-help' : 'find-help',
              toFocusOnClose: e.currentTarget,
            })
          }
        >
          Help
        </button>
      </DialogButtons>
    </Dialog>
  );
}
