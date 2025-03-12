import styles from './color-help-dialog.module.css';
import { Dialog, DialogType } from './dialog';
import { DialogButtons } from './dialog-buttons';

type ColorHelpDialogParams = {
  open: boolean;
  setCurrentDialog: React.Dispatch<React.SetStateAction<DialogType | null>>;
};

export function ColorHelpDialog({
  open,
  setCurrentDialog,
}: ColorHelpDialogParams): React.JSX.Element {
  return (
    <Dialog open={open} title="Colors">
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
      <DialogButtons>
        <button
          type="button"
          className={styles.active}
          onClick={() => {
            setCurrentDialog('color');
          }}
        >
          OK
        </button>
      </DialogButtons>
    </Dialog>
  );
}
