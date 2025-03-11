import { useRef } from 'react';

import { Dialog } from '../dialog';
import styles from './color-help-dialog.module.css';

type ColorHelpDialogParams = {
  open: boolean;
  setCurrentDialog: React.Dispatch<React.SetStateAction<Dialog | null>>;
};

export function ColorHelpDialog({
  open,
  setCurrentDialog,
}: ColorHelpDialogParams): React.JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);

  dialogRef.current?.[open ? 'showModal' : 'close']();

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <div className={styles.title}>Colors</div>
      <div className={styles.help}>
        <p>Determines the color of screen elements.</p>
        <ol>
          <li>From the Item list, click the item you want to change.</li>
          <li>From the Foreground list, click the color you want the item to be.</li>
          <li>From the Background list, click the color you want the background to be.</li>
        </ol>
        <p>Tip:</p>
        <ul>
          <li>
            To go back to the original color scheme, click Default. This undoes all the changes you
            have made.
          </li>
        </ul>
      </div>
      <div className={styles.buttons}>
        <button
          type="button"
          className={styles.active}
          onClick={() => {
            setCurrentDialog('color');
          }}
        >
          OK
        </button>
      </div>
    </dialog>
  );
}
