import { useCallback } from 'react';

import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import styles from './about-dialog.module.css';
import { Dialog } from './dialog';
import { DialogButtons } from './dialog-buttons';

type AboutDialogParams = {
  open: boolean;
  closeDialog: () => void;
};

export function AboutDialog({ open, closeDialog }: AboutDialogParams): React.JSX.Element {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (!open) {
        return;
      }

      if (e.key === 'Enter') {
        closeDialog();
      }
    },
    [closeDialog, open],
  );

  useKeyDownHandler(handleKeyDown);

  return (
    <Dialog open={open} title="About" closeDialog={closeDialog}>
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
            closeDialog();
          }}
        >
          OK
        </button>
      </DialogButtons>
    </Dialog>
  );
}
