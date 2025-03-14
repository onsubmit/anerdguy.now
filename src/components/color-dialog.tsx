import { useRef, useState } from 'react';

import { getCachedItem, setCachedItem } from '../localStorage';
import styles from './color-dialog.module.css';
import { ColorOptionList } from './color-option-list';
import { colors, getKnownColor, KnownColor } from './colors';
import { Dialog, DialogType } from './dialog';
import { DialogButtons } from './dialog-buttons';
import { OptionListOperations, OptionsList } from './option-list';
import { KnownThemeableItem, knownThemeableItems, themeableItems } from './themeable-items';

type ColorDialogParams = {
  open: boolean;
  openDialog: (type: DialogType, opener: HTMLElement) => void;
  closeDialog: () => void;
};

export type ChosenColors = Partial<
  Record<KnownThemeableItem, Partial<{ foreground: KnownColor; background: KnownColor }>>
>;

const setCssVariable = (
  layer: 'foreground' | 'background',
  item: KnownThemeableItem,
  color: KnownColor,
): void => {
  document.documentElement.style.setProperty(
    `${themeableItems[item].cssVariableName}-${layer}`,
    `var(${colors[color].cssVariableName})`,
  );
};

const cachedTheme = getCachedItem('theme');
if (cachedTheme) {
  for (const [key, { foreground, background }] of Object.entries(cachedTheme)) {
    const item = key as KnownThemeableItem;
    if (foreground) {
      setCssVariable('foreground', item, foreground);
    }

    if (background) {
      setCssVariable('background', item, background);
    }
  }
}

const initialItem: KnownThemeableItem = 'Normal Text';
const initialForegroundColor: KnownColor = cachedTheme?.[initialItem]?.foreground ?? 'White';
const initialBackgroundColor: KnownColor = cachedTheme?.[initialItem]?.background ?? 'Blue';
const initialColors: ChosenColors = {
  [initialItem]: {
    foreground: initialForegroundColor,
    background: initialBackgroundColor,
  },
};

export function ColorDialog({
  open,
  openDialog,
  closeDialog,
}: ColorDialogParams): React.JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const foregroundColorRef = useRef<OptionListOperations<KnownColor>>(null);
  const backgroundColorRef = useRef<OptionListOperations<KnownColor>>(null);

  const [selectedItem, setSelectedItem] = useState<KnownThemeableItem>(initialItem);
  const [selectedForeground, setSelectedForeground] = useState<KnownColor>(initialForegroundColor);
  const [selectedBackground, setSelectedBackground] = useState<KnownColor>(initialBackgroundColor);
  const [originalColors, setOriginalColors] = useState<ChosenColors>(initialColors);
  const [pendingColors, setPendingColors] = useState<ChosenColors>({});

  dialogRef.current?.[open ? 'showModal' : 'close']();
  // TODO: Remove this hack and figure out how to scroll the selected colors after the dialog loads
  setTimeout(() => {
    foregroundColorRef.current?.refocus(selectedForeground);
    backgroundColorRef.current?.refocus(selectedBackground);
  });

  const onSelectedItemChange = (item: KnownThemeableItem): void => {
    const currentColors = getCurrentItemColors(item);
    const { foreground, background } = currentColors;

    setSelectedForeground(foreground);
    foregroundColorRef.current?.refocus(foreground);

    setSelectedBackground(background);
    backgroundColorRef.current?.refocus(background);

    if (!originalColors[item]?.foreground || !originalColors[item]?.background) {
      setOriginalColors((x) => ({
        ...x,
        [item]: currentColors,
      }));
    }

    setPendingColors((x) => ({
      ...x,
      [item]: currentColors,
    }));
  };

  const onSelectedForegroundChange = (color: KnownColor): void => {
    setCssVariable('foreground', selectedItem, color);
    setPendingColors((x) => ({
      ...x,
      [selectedItem]: {
        ...x[selectedItem],
        foreground: color,
      },
    }));
  };

  const onSelectedBackgroundChange = (color: KnownColor): void => {
    setCssVariable('background', selectedItem, color);
    setPendingColors((x) => ({
      ...x,
      [selectedItem]: {
        ...x[selectedItem],
        background: color,
      },
    }));
  };

  const getCurrentItemColors = (
    item: KnownThemeableItem,
  ): { foreground: KnownColor; background: KnownColor } => {
    const cssForegroundColor = window
      .getComputedStyle(document.body)
      .getPropertyValue(`${themeableItems[item].cssVariableName}-foreground`)
      .toLocaleLowerCase();

    const cssBackgroundColor = window
      .getComputedStyle(document.body)
      .getPropertyValue(`${themeableItems[item].cssVariableName}-background`)
      .toLocaleLowerCase();

    return {
      foreground: getKnownColor(cssForegroundColor),
      background: getKnownColor(cssBackgroundColor),
    };
  };

  const setDefaults = (): void => {
    const defaults: ChosenColors = {};
    for (const item of knownThemeableItems) {
      const { foreground, background } = (defaults[item] = themeableItems[item].defaults);

      if (!originalColors[item]?.foreground || !originalColors[item]?.background) {
        const currentColors = getCurrentItemColors(item);
        setOriginalColors((x) => ({
          ...x,
          [item]: currentColors,
        }));
      }

      setCssVariable('foreground', item, foreground);
      setCssVariable('background', item, background);

      if (selectedItem === item) {
        setSelectedForeground(foreground);
        foregroundColorRef.current?.refocus(foreground);
        setSelectedBackground(background);
        backgroundColorRef.current?.refocus(background);
      }
    }

    setPendingColors(defaults);
  };

  return (
    <Dialog open={open} title="Colors" closeDialog={closeDialog}>
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
      <DialogButtons>
        <button type="button" onClick={setDefaults}>
          Default
        </button>
        <button
          type="button"
          className={styles.active}
          onClick={() => {
            setOriginalColors((x) => {
              const newValue = {
                ...x,
                ...pendingColors,
              };

              setCachedItem('theme', newValue);
              return newValue;
            });

            closeDialog();
          }}
        >
          OK
        </button>
        <button
          type="button"
          onClick={() => {
            for (const [name, { foreground, background }] of Object.entries(originalColors)) {
              const item = name as KnownThemeableItem;
              if (foreground) {
                setCssVariable('foreground', item, foreground);
                if (name === selectedItem) {
                  setSelectedForeground(foreground);
                }
              }

              if (background) {
                setCssVariable('background', item, background);
                if (name === selectedItem) {
                  setSelectedBackground(background);
                }
              }
            }

            closeDialog();
          }}
        >
          Cancel
        </button>
        <button type="button" onClick={(e) => openDialog('color-help', e.currentTarget)}>
          Help
        </button>
      </DialogButtons>
    </Dialog>
  );
}
