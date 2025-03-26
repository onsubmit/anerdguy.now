import { useCallback } from 'react';

import { useAppDispatch } from '../hooks';
import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { close } from '../slices/dialogSlice';
import styles from './about-dialog.module.css';
import { Dialog } from './dialog';
import { DialogButtons } from './dialog-buttons';

type AboutDialogParams = {
  open: boolean;
};

export function AboutDialog({ open }: AboutDialogParams): React.JSX.Element {
  const dispatch = useAppDispatch();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (!open) {
        return;
      }

      if (e.key === 'Enter') {
        dispatch(close(null));
      }
    },
    [open, dispatch],
  );

  useKeyDownHandler(handleKeyDown);

  return (
    <Dialog open={open} title="About">
      <div className={styles.about}>
        <p>Andy Young</p>
        <p>Version 1.0.0</p>
        <p>Copyright (c) Andy Young 1982</p>
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
