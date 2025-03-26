import { useAppDispatch } from '../hooks';
import { close } from '../slices/dialogSlice';
import styles from './color-help-dialog.module.css';
import { Dialog } from './dialog';
import { DialogButtons } from './dialog-buttons';
import { Button } from './ui/button';

type ColorHelpDialogParams = {
  open: boolean;
};

export function ColorHelpDialog({ open }: ColorHelpDialogParams): React.JSX.Element {
  const dispatch = useAppDispatch();

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
        <Button text="OK" onClick={() => dispatch(close('color'))}></Button>
      </DialogButtons>
    </Dialog>
  );
}
