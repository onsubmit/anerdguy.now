import { useCallback } from 'react';

import { dialogTypes } from '../dialogTypes';
import { useAppDispatch } from '../hooks';
import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { close } from '../slices/dialogSlice';
import { Dialog } from './dialog';
import { DialogButtons } from './dialog-buttons';
import styles from './events-dialog.module.css';

type EventsDialogParams = {
  open: boolean;
};

export function EventsDialog({ open }: EventsDialogParams): React.JSX.Element {
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
    [dispatch, open],
  );

  useKeyDownHandler(handleKeyDown);

  return (
    <Dialog open={open} title="Events">
      <div className={styles.events}>
        <p>You can edit the contents of any page on this site.</p>
        <p>Events can be dispatched from the document to provide interactivity.</p>
        <ul>
          <li>
            <p>toggle-edit | Toggles between Edit and Preview mode.</p>
            <p>{`document.dispatchEvent(new Event('toggle-edit'));`}</p>
          </li>
          <li>
            <p>open-dialog | Opens a dialog.</p>
            <pre>{`document.dispatchEvent(
  new CustomEvent('open-dialog', { detail: { type: 'color' } }));
`}</pre>
            <p>Known dialog types:</p>
            <ul>
              {[...dialogTypes]
                .toSorted((a, b) => a.localeCompare(b))
                .map((t) =>
                  t !== 'error' ? (
                    <li key={t}>{t}</li>
                  ) : (
                    <li key={t}>
                      {t}
                      <ul>
                        <li>{`params: { message: string, detail: string }`}</li>
                      </ul>
                    </li>
                  ),
                )}
            </ul>
          </li>
        </ul>

        <p>Examples can be found by switching to Edit mode.</p>
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
