import { useAppDispatch } from '../hooks';
import { close } from '../slices/dialogSlice';
import { Dialog } from './dialog';
import { DialogButtons } from './dialog-buttons';
import styles from './replace-help-dialog.module.css';

type ReplaceHelpDialogParams = {
  open: boolean;
};

export function ReplaceHelpDialog({ open }: ReplaceHelpDialogParams): React.JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <Dialog open={open} title="Replace">
      <div className={styles.help}>
        <p>Finds specified text and replaces it with new text.</p>
        <ul>
          <li>
            The first occurrence of the text after the cursor is replaced. Searches automatically
            wrap around.
          </li>
          <li>To replace all occurrences of the text at once, click the Replace All button.</li>
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
            dispatch(close('replace'));
          }}
        >
          OK
        </button>
      </DialogButtons>
    </Dialog>
  );
}
