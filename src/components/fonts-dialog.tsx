import { useCallback, useEffect, useRef, useState } from 'react';

import { FontName, fontNames, FontSize, fontSizes } from '../fonts';
import { useAppDispatch } from '../hooks';
import { useDispatch } from '../hooks/useDispatch';
import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { getCachedItem, setCachedItem } from '../localStorage';
import { close } from '../slices/dialogSlice';
import { setFont } from '../slices/fontSlice';
import { Dialog } from './dialog';
import { DialogButtons } from './dialog-buttons';
import styles from './fonts-dialog.module.css';
import { OptionListOperations, OptionsList } from './option-list';

type FontsDialogParams = {
  open: boolean;
  selectedFont: FontName;
};

export function FontsDialog({ open, selectedFont }: FontsDialogParams): React.JSX.Element {
  const dispatch = useAppDispatch();

  const fontNameRef = useRef<OptionListOperations<FontName>>(null);
  const fontSizeRef = useRef<OptionListOperations<FontSize>>(null);

  const [fontSize, setFontSize] = useState<FontSize>(getCachedItem('fontSize') ?? '16');
  const [originalFont, setOriginalFont] = useState<FontName>(selectedFont);
  const [originalFontSize, setOriginalFontSize] = useState<FontSize>(fontSize);

  const okayHandler = useCallback(() => {
    setOriginalFont(selectedFont);
    setOriginalFontSize(fontSize);
    setCachedItem('fontSize', fontSize);
    dispatch(close(null));
  }, [dispatch, fontSize, selectedFont]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (!open) {
        return;
      }

      if (e.key === 'Enter') {
        okayHandler();
        e.preventDefault();
        return;
      }

      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const order = [fontNameRef.current, fontSizeRef.current];
        const current = order.findIndex((r) => r?.hasActiveElement());
        const amount = e.key === 'ArrowLeft' ? -1 : 1;
        let newIndex = (current + amount) % order.length;
        if (newIndex < 0) {
          newIndex = order.length - 1;
        }

        if (newIndex === 0) {
          fontNameRef.current?.focus(selectedFont);
        } else {
          fontSizeRef.current?.focus(fontSize);
        }
      }
    },
    [fontSize, okayHandler, open, selectedFont],
  );

  const setSelectedFont = useDispatch(setFont);

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
    <Dialog open={open} title="Fonts" onCancel={cancelHandler}>
      <div className={styles.settings}>
        <div>
          <div>Family:</div>
          <div>
            <OptionsList
              ref={fontNameRef}
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
              ref={fontSizeRef}
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
            dispatch(close(null));
          }}
        >
          Cancel
        </button>
      </DialogButtons>
    </Dialog>
  );
}
