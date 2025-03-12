import { Dialog, DialogType } from './dialog';
import { DialogButtons } from './dialog-buttons';
import styles from './find-dialog.module.css';

type FindDialogParams = {
  open: boolean;
  replace: boolean;
  setCurrentDialog: React.Dispatch<React.SetStateAction<DialogType | null>>;
};

export function FindDialog({
  open,
  replace,
  setCurrentDialog,
}: FindDialogParams): React.JSX.Element {
  return (
    <Dialog open={open} title="Find">
      <div className={styles.find}>
        <label>
          <span>Find What:</span>
          <input type="text" autoFocus={true}></input>
        </label>
        {replace ? (
          <>
            <label>
              <span>Replace With:</span>
              <input type="text"></input>
            </label>
          </>
        ) : undefined}
        <label>
          <input type="checkbox"></input>
          <span>Match Whole Word Only</span>
        </label>
        <label>
          <input type="checkbox"></input>
          <span>Match Case</span>
        </label>
      </div>
      <DialogButtons>
        <button
          type="button"
          className={styles.active}
          onClick={() => {
            setCurrentDialog(null);
          }}
        >
          OK
        </button>
        <button
          type="button"
          className={styles.active}
          onClick={() => {
            setCurrentDialog(null);
          }}
        >
          Cancel
        </button>
        <button type="button" className={styles.active}>
          Help
        </button>
      </DialogButtons>
    </Dialog>
  );
}
