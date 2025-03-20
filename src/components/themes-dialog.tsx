import { useCallback, useState } from 'react';

import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { ThemeName, themeNames } from '../themes';
import { Dialog } from './dialog';
import { DialogButtons } from './dialog-buttons';
import { OptionsList } from './option-list';
import styles from './themes-dialog.module.css';

type ThemesDialogParams = {
  open: boolean;
  closeDialog: () => void;
};

export function ThemesDialog({ open, closeDialog }: ThemesDialogParams): React.JSX.Element {
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>('default');

  const okayHandler = useCallback(() => {
    closeDialog();
  }, [closeDialog]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (!open) {
        return;
      }

      if (e.key === 'Enter') {
        okayHandler();
        e.preventDefault();
      }
    },
    [okayHandler, open],
  );

  useKeyDownHandler(handleKeyDown);

  return (
    <Dialog open={open} title="Themes" closeDialog={closeDialog}>
      <div className={styles.open}>
        <OptionsList
          selectedOption={selectedTheme}
          setSelectedOption={setSelectedTheme}
          options={themeNames}
          onDoubleClick={okayHandler}
        ></OptionsList>
      </div>

      <DialogButtons>
        <button type="button" onClick={okayHandler}>
          OK
        </button>
        <button type="button" onClick={() => closeDialog()}>
          Cancel
        </button>
        <button type="button">Help</button>
      </DialogButtons>
    </Dialog>
  );
}
