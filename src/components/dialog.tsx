import { useCallback, useEffect, useRef } from 'react';

import styles from './dialog.module.css';
import { OpenErrorDialogParams } from './error-dialog';

export type DialogType =
  | 'open-file'
  | 'color'
  | 'color-help'
  | 'about'
  | 'find'
  | 'find-help'
  | 'replace'
  | 'replace-help'
  | 'error';

export type OpenDialogEvent = {
  type: DialogType;
};

export type OpenDialogParams<T extends DialogType> = T extends 'error'
  ? OpenErrorDialogParams
  : never;

export type OpenDialogArgs<T extends DialogType> = {
  type: T;
  params?: OpenDialogParams<T>;
  toFocusOnClose?: HTMLElement | null;
};

type DialogParams = {
  title: string;
  children: React.ReactNode;
  open: boolean;
  closeDialog: (typeToOpen: DialogType | null) => void;
  onCancel?: () => void;
};

export function Dialog({
  title,
  children,
  open,
  closeDialog,
  onCancel,
}: DialogParams): React.JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);

  dialogRef.current?.[open ? 'showModal' : 'close']();

  const cancelHandler = useCallback((): void => {
    onCancel?.();
    closeDialog(null);
  }, [closeDialog, onCancel]);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.addEventListener('cancel', cancelHandler);
    return (): void => dialog?.removeEventListener('cancel', cancelHandler);
  }, [cancelHandler]);

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <div className={styles.title}>{title}</div>
      {children}
    </dialog>
  );
}
