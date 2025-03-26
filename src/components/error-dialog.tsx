import { useCallback } from 'react';

import { useAppDispatch } from '../hooks';
import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { close } from '../slices/dialogSlice';
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
};

export function ErrorDialog({ message, detail, open }: ErrorDialogParams): React.JSX.Element {
  const dispatch = useAppDispatch();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (!open) {
        return;
      }

      if (e.key === 'Enter') {
        dispatch(close(null));
        e.preventDefault();
      }
    },
    [dispatch, open],
  );

  useKeyDownHandler(handleKeyDown);

  return (
    <Dialog open={open} title="Error">
      <div className={styles.error}>
        <p>{message}</p>
        <p>{detail}</p>
      </div>
      <DialogButtons>
        <button
          type="button"
          className={styles.active}
          onClick={() => {
            dispatch(close(null));
          }}
        >
          OK
        </button>
      </DialogButtons>
    </Dialog>
  );
}
