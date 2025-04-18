import { RefObject, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';

import { EditorOperations } from '../editor-operation';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useCustomEvent } from '../hooks/useCustomEvent';
import { open, selectDialog } from '../slices/dialogSlice';
import { AboutDialog } from './about-dialog';
import { ColorDialog } from './color-dialog';
import { ColorHelpDialog } from './color-help-dialog';
import { DialogType, OpenDialogArgs, OpenDialogEvent } from './dialog';
import { ErrorDialog, OpenErrorDialogParams } from './error-dialog';
import { EventsDialog } from './events-dialog';
import { FindDialog, FindDialogOperations } from './find-dialog';
import { FindHelpDialog } from './find-help-dialog';
import { FontsDialog } from './fonts-dialog';
import { OpenFileDialog } from './open-file-dialog';
import { ReplaceHelpDialog } from './replace-help-dialog';
import { ThemesDialog } from './themes-dialog';

export type DialogsOperations = {
  openDialog: <T extends DialogType>(args: OpenDialogArgs<T>) => void;
};

export type DialogsParams = {
  openFile: (filename: string) => Promise<void>;
  focusEditor: () => void;
  editorRef: RefObject<EditorOperations | null>;
  ref: RefObject<DialogsOperations | null>;
};

export function Dialogs({
  openFile,
  focusEditor,
  editorRef,
  ref,
}: DialogsParams): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const currentDialog = useAppSelector(selectDialog);

  const findDialogRef = useRef<FindDialogOperations>(null);
  const toFocusOnDialogCloseRef = useRef<Array<HTMLElement>>([]);

  const [errorDialogArgs, setErrorDialogArgs] = useState<OpenErrorDialogParams>({
    message: '',
    detail: '',
  });

  const openDialog = useCallback(
    <T extends DialogType>({ type, params, toFocusOnClose }: OpenDialogArgs<T>): void => {
      if (type === 'error') {
        setErrorDialogArgs(
          params ?? {
            message: '',
            detail: '',
          },
        );
      }

      dispatch(open(type));

      if (toFocusOnClose) {
        toFocusOnDialogCloseRef.current.push(toFocusOnClose);
      }
    },
    [dispatch],
  );

  useCustomEvent([
    {
      name: 'open-dialog',
      handler: (event: CustomEventInit<OpenDialogEvent<DialogType>>): void => {
        if (!event.detail) {
          return;
        }

        const { type } = event.detail;
        if (type === 'error') {
          openDialog({ type, params: event.detail.params, toFocusOnClose: null });
        } else {
          openDialog({ type, toFocusOnClose: null });
        }
      },
    },
  ]);

  useEffect(() => {
    if (currentDialog === null) {
      setTimeout(() => {
        if (toFocusOnDialogCloseRef.current.length) {
          toFocusOnDialogCloseRef.current.pop()?.focus();
        } else if (searchParams.get('edit')) {
          focusEditor();
        }
      });
    }
  }, [currentDialog, focusEditor, searchParams]);

  useImperativeHandle(ref, () => {
    return {
      openDialog,
    };
  }, [openDialog]);

  return (
    <>
      <OpenFileDialog
        open={currentDialog === 'open-file'}
        openDialog={openDialog}
        openFile={openFile}
      ></OpenFileDialog>
      <ThemesDialog open={currentDialog === 'themes'}></ThemesDialog>
      <FontsDialog open={currentDialog === 'fonts'}></FontsDialog>
      <ColorDialog open={currentDialog === 'color'} openDialog={openDialog}></ColorDialog>
      <ColorHelpDialog open={currentDialog === 'color-help'}></ColorHelpDialog>
      <EventsDialog open={currentDialog === 'events'}></EventsDialog>
      <AboutDialog open={currentDialog === 'about'}></AboutDialog>
      <FindDialog
        ref={findDialogRef}
        editorRef={editorRef}
        replace={currentDialog === 'replace'}
        open={currentDialog === 'find' || currentDialog === 'replace'}
        openDialog={openDialog}
      ></FindDialog>
      <FindHelpDialog open={currentDialog === 'find-help'}></FindHelpDialog>
      <ReplaceHelpDialog open={currentDialog === 'replace-help'}></ReplaceHelpDialog>
      <ErrorDialog open={currentDialog === 'error'} {...{ ...errorDialogArgs }}></ErrorDialog>
    </>
  );
}
