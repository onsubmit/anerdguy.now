import { useCallback, useEffect, useRef } from 'react';

import styles from './dialog.module.css';

export type DialogType = 'color' | 'color-help' | 'about' | 'find' | 'replace';

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
