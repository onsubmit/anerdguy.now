import { useCallback, useState } from 'react';

import { FontName, fontNames } from '../fonts';
import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { Dialog } from './dialog';
import { DialogButtons } from './dialog-buttons';
import styles from './fonts-dialog.module.css';
import { OptionsList } from './option-list';

type FontsDialogParams = {
  open: boolean;
  closeDialog: () => void;
  selectedFont: FontName;
  setSelectedFont: React.Dispatch<React.SetStateAction<FontName>>;
};

export function FontsDialog({
  open,
  closeDialog,
  selectedFont,
  setSelectedFont,
}: FontsDialogParams): React.JSX.Element {
  const [originalFont, setOriginalFont] = useState<FontName>(selectedFont);

  const okayHandler = useCallback(() => {
    setOriginalFont(selectedFont);
    closeDialog();
  }, [closeDialog, selectedFont]);

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

  const cancelHandler = useCallback((): void => {
    setSelectedFont(originalFont);
  }, [originalFont, setSelectedFont]);

  return (
    <Dialog open={open} title="Fonts" closeDialog={closeDialog} onCancel={cancelHandler}>
      <div className={styles.open}>
        <OptionsList
          selectedOption={selectedFont}
          setSelectedOption={setSelectedFont}
          options={fontNames}
          onDoubleClick={okayHandler}
        ></OptionsList>
      </div>

      <DialogButtons>
        <button type="button" onClick={okayHandler}>
          OK
        </button>
        <button
          type="button"
          onClick={() => {
            cancelHandler();
            closeDialog();
          }}
        >
          Cancel
        </button>
      </DialogButtons>
    </Dialog>
  );
}
