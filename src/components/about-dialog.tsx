import styles from './about-dialog.module.css';
import { Dialog, DialogType } from './dialog';
import { DialogButtons } from './dialog-buttons';

type AboutDialogParams = {
  open: boolean;
  setCurrentDialog: React.Dispatch<React.SetStateAction<DialogType | null>>;
};

export function AboutDialog({ open, setCurrentDialog }: AboutDialogParams): React.JSX.Element {
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
            setCurrentDialog(null);
          }}
        >
          OK
        </button>
      </DialogButtons>
    </Dialog>
  );
}
