import { useCallback } from 'react';

import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { Dialog } from './dialog';
import { DialogButtons } from './dialog-buttons';
import styles from './error-dialog.module.css';

export type OpenErrorDialogParams = {
  message: string;
  detail: string;
};

type ErrorDialogParams = {
  message: string;
  detail: string;
  open: boolean;
  closeDialog: () => void;
};

export function ErrorDialog({
  message,
  detail,
  open,
  closeDialog,
}: ErrorDialogParams): React.JSX.Element {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (!open) {
        return;
      }

      if (e.key === 'Enter') {
        closeDialog();
        e.preventDefault();
      }
    },
    [closeDialog, open],
  );

  useKeyDownHandler(handleKeyDown);

  return (
    <Dialog open={open} title="Error" closeDialog={closeDialog}>
      <div className={styles.error}>
        <p>{message}</p>
        <p>{detail}</p>
      </div>
      <DialogButtons>
        <button
          type="button"
          className={styles.active}
          onClick={() => {
            closeDialog();
          }}
        >
          OK
        </button>
      </DialogButtons>
    </Dialog>
  );
}
