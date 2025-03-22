import { useCallback, useEffect, useState } from 'react';

import { FontName, fontNames, FontSize, fontSizes } from '../fonts';
import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { getCachedItem, setCachedItem } from '../localStorage';
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
  const [fontSize, setFontSize] = useState<FontSize>(getCachedItem('fontSize') ?? '16');
  const [originalFont, setOriginalFont] = useState<FontName>(selectedFont);
  const [originalFontSize, setOriginalFontSize] = useState<FontSize>(fontSize);

  const okayHandler = useCallback(() => {
    setOriginalFont(selectedFont);
    setOriginalFontSize(fontSize);
    setCachedItem('fontSize', fontSize);
    closeDialog();
  }, [closeDialog, fontSize, selectedFont]);

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
    setFontSize(originalFontSize);
    document.documentElement.style.setProperty('--root-font-size', `${originalFontSize}px`);
  }, [originalFont, originalFontSize, setSelectedFont]);

  useEffect(() => {
    document.documentElement.style.setProperty('--root-font-size', `${originalFontSize}px`);
  }, [open, originalFontSize]);

  return (
    <Dialog open={open} title="Fonts" closeDialog={closeDialog} onCancel={cancelHandler}>
      <div className={styles.settings}>
        <div>
          <div>Family:</div>
          <div>
            <OptionsList
              selectedOption={selectedFont}
              setSelectedOption={setSelectedFont}
              options={fontNames}
              onDoubleClick={okayHandler}
            ></OptionsList>
          </div>
        </div>
        <div>
          <div>Size:</div>
          <div>
            <OptionsList
              selectedOption={fontSize}
              setSelectedOption={setFontSize}
              onSelectionChange={(size) => {
                document.documentElement.style.setProperty('--root-font-size', `${size}px`);
              }}
              options={fontSizes}
              onDoubleClick={okayHandler}
            ></OptionsList>
          </div>
        </div>
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
