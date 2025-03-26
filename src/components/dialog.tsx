import { useCallback, useEffect, useRef } from 'react';

import { dialogTypes } from '../dialogTypes';
import { useAppDispatch } from '../hooks';
import { close } from '../slices/dialogSlice';
import styles from './dialog.module.css';
import { OpenErrorDialogParams } from './error-dialog';

export type DialogType = (typeof dialogTypes)[number];

export type OpenDialogEvent<T extends DialogType> = {
  type: T;
  params: OpenDialogParams<T>;
};

export type OpenDialogParams<T extends DialogType> = T extends 'error'
  ? OpenErrorDialogParams
  : never;

export type OpenDialogArgs<T extends DialogType> = {
  type: T;
  params?: OpenDialogParams<T>;
  toFocusOnClose: HTMLElement | null;
};

type DialogParams = {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onCancel?: () => void;
};

export function Dialog({ title, children, open, onCancel }: DialogParams): React.JSX.Element {
  const dispatch = useAppDispatch();
  const dialogRef = useRef<HTMLDialogElement>(null);

  dialogRef.current?.[open ? 'showModal' : 'close']();

  const cancelHandler = useCallback((): void => {
    onCancel?.();
    dispatch(close(null));
  }, [dispatch, onCancel]);

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
