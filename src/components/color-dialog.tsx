import { useRef, useState } from 'react';

import styles from './color-dialog.module.css';
import { ColorOptionList } from './color-option-list';
import { colors, getKnownColor, KnownColor } from './colors';
import { OptionListOperations, OptionsList } from './option-list';
import { KnownThemeableItem, knownThemeableItems, themeableItems } from './themeable-items';

type ColorDialogParams = {
  open: boolean;
  setCurrentDialog: React.Dispatch<React.SetStateAction<'color' | null>>;
};

export function ColorDialog({ open, setCurrentDialog }: ColorDialogParams): React.JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const foregroundColorRef = useRef<OptionListOperations<KnownColor>>(null);
  const backgroundColorRef = useRef<OptionListOperations<KnownColor>>(null);

  const [selectedItem, setSelectedItem] = useState<KnownThemeableItem>('Normal Text');
  const [selectedForeground, setSelectedForeground] = useState<KnownColor>('White');
  const [selectedBackground, setSelectedBackground] = useState<KnownColor>('Blue');

  dialogRef.current?.[open ? 'showModal' : 'close']();
  foregroundColorRef.current?.refocus(selectedForeground);
  backgroundColorRef.current?.refocus(selectedBackground);

  const onSelectedItemChange = (item: KnownThemeableItem): void => {
    const cssForegroundColor = window
      .getComputedStyle(document.body)
      .getPropertyValue(`${themeableItems[item].cssVariableName}-foreground`)
      .toLocaleLowerCase();

    const cssBackgroundColor = window
      .getComputedStyle(document.body)
      .getPropertyValue(`${themeableItems[item].cssVariableName}-background`)
      .toLocaleLowerCase();

    const foregroundColorName = getKnownColor(cssForegroundColor);
    setSelectedForeground(foregroundColorName);
    foregroundColorRef.current?.refocus(foregroundColorName);

    const backgroundColorName = getKnownColor(cssBackgroundColor);
    setSelectedBackground(backgroundColorName);
    backgroundColorRef.current?.refocus(backgroundColorName);
  };

  const onSelectedForegroundChange = (color: KnownColor): void => {
    document.documentElement.style.setProperty(
      `${themeableItems[selectedItem].cssVariableName}-foreground`,
      `var(${colors[color].cssVariableName})`,
    );
  };

  const onSelectedBackgroundChange = (color: KnownColor): void => {
    document.documentElement.style.setProperty(
      `${themeableItems[selectedItem].cssVariableName}-background`,
      `var(${colors[color].cssVariableName})`,
    );
  };

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <div className={styles.title}>Colors</div>
      <div className={styles.settings}>
        <div>
          <div>Item:</div>
          <OptionsList
            selectedOption={selectedItem}
            setSelectedOption={setSelectedItem}
            options={knownThemeableItems}
            onSelectionChange={onSelectedItemChange}
          ></OptionsList>
        </div>
        <div>
          <div>Foreground:</div>
          <ColorOptionList
            ref={foregroundColorRef}
            selectedColor={selectedForeground}
            setSelectedColor={setSelectedForeground}
            onSelectedColorChange={onSelectedForegroundChange}
          ></ColorOptionList>
        </div>
        <div>
          <div>Background:</div>
          <ColorOptionList
            ref={backgroundColorRef}
            selectedColor={selectedBackground}
            setSelectedColor={setSelectedBackground}
            onSelectedColorChange={onSelectedBackgroundChange}
          ></ColorOptionList>
        </div>
      </div>
      <div className={styles.buttons}>
        <button type="button">Default</button>
        <button type="button" className={styles.active} onClick={() => setCurrentDialog(null)}>
          OK
        </button>
        <button type="button" onClick={() => setCurrentDialog(null)}>
          Cancel
        </button>
        <button type="button">Help</button>
      </div>
    </dialog>
  );
}
