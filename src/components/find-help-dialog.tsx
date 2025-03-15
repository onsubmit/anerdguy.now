import { Dialog, DialogType } from './dialog';
import { DialogButtons } from './dialog-buttons';
import styles from './find-help-dialog.module.css';

type FindHelpDialogParams = {
  open: boolean;
  closeDialog: (typeToOpen: DialogType | null) => void;
};

export function FindHelpDialog({ open, closeDialog }: FindHelpDialogParams): React.JSX.Element {
  return (
    <Dialog open={open} title="Find" closeDialog={closeDialog}>
      <div className={styles.help}>
        <p>Finds text in a file.</p>
        <ul>
          <li>
            The first occurrence of the text after the cursor is selected. Searches automatically
            wrap around.
          </li>
          <li>
            To find text that is an entire word and not part of a longer word, click Match Whole
            Word Only.
          </li>
          <li>
            To find text with the same combination of uppercase and lowercase letters as the find
            text, click Match Case.
          </li>
        </ul>
      </div>
      <DialogButtons>
        <button
          type="button"
          className={styles.active}
          onClick={() => {
            closeDialog('find');
          }}
        >
          OK
        </button>
      </DialogButtons>
    </Dialog>
  );
}
