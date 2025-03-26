import { useCallback, useEffect, useRef, useState } from 'react';

import { getKnownColor, KnownColor } from '../colors';
import { useAppDispatch } from '../hooks';
import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { getCachedItem, setCachedItem } from '../localStorage';
import { close } from '../slices/dialogSlice';
import {
  cssVariableNames,
  KnownThemeableItem,
  knownThemeableItems,
  setCssVariable,
} from '../themes';
import styles from './color-dialog.module.css';
import { ColorOptionList } from './color-option-list';
import { Dialog, DialogType, OpenDialogArgs } from './dialog';
import { DialogButtons } from './dialog-buttons';
import { OptionListOperations, OptionsList } from './option-list';

type ColorDialogParams = {
  open: boolean;
  openDialog: <T extends DialogType>({ type, toFocusOnClose }: OpenDialogArgs<T>) => void;
};

export type ChosenColors = Partial<
  Record<KnownThemeableItem, Partial<{ foreground: KnownColor; background: KnownColor }>>
>;

export function ColorDialog({ open, openDialog }: ColorDialogParams): React.JSX.Element {
  const dispatch = useAppDispatch();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const itemRef = useRef<OptionListOperations<KnownThemeableItem>>(null);
  const foregroundColorRef = useRef<OptionListOperations<KnownColor>>(null);
  const backgroundColorRef = useRef<OptionListOperations<KnownColor>>(null);

  const [selectedItem, setSelectedItem] = useState<KnownThemeableItem>('Normal Text');
  const [selectedForeground, setSelectedForeground] = useState<KnownColor>('White');
  const [selectedBackground, setSelectedBackground] = useState<KnownColor>('Black');
  const [originalColors, setOriginalColors] = useState<ChosenColors>({});
  const [pendingColors, setPendingColors] = useState<ChosenColors>({});

  dialogRef.current?.[open ? 'showModal' : 'close']();

  const okayHandler = useCallback(() => {
    setOriginalColors((x) => {
      const newValue = {
        ...x,
        ...pendingColors,
      };

      setCachedItem('theme', newValue);
      return newValue;
    });

    setCachedItem('selectedTheme', 'Custom');
    dispatch(close(null));
  }, [dispatch, pendingColors]);

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
        const order = [itemRef.current, foregroundColorRef.current, backgroundColorRef.current];
        const current = order.findIndex((r) => r?.hasActiveElement());
        const amount = e.key === 'ArrowLeft' ? -1 : 1;
        let newIndex = (current + amount) % order.length;
        if (newIndex < 0) {
          newIndex = order.length - 1;
        }

        if (newIndex === 0) {
          itemRef.current?.focus(selectedItem);
        } else if (newIndex === 1) {
          foregroundColorRef.current?.focus(selectedForeground);
        } else {
          backgroundColorRef.current?.focus(selectedBackground);
        }
      }
    },
    [okayHandler, open, selectedBackground, selectedForeground, selectedItem],
  );

  useKeyDownHandler(handleKeyDown);

  const cancelHandler = useCallback((): void => {
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
  }, [originalColors, selectedItem]);

  const onSelectedItemChange = (item: KnownThemeableItem): void => {
    const currentColors = getCurrentItemColors(item);
    const { foreground, background } = currentColors;

    setSelectedForeground(foreground);
    foregroundColorRef.current?.reselect(foreground);

    setSelectedBackground(background);
    backgroundColorRef.current?.reselect(background);

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
      .getPropertyValue(`${cssVariableNames[item]}-foreground`)
      .toLocaleLowerCase();

    const cssBackgroundColor = window
      .getComputedStyle(document.body)
      .getPropertyValue(`${cssVariableNames[item]}-background`)
      .toLocaleLowerCase();

    return {
      foreground: getKnownColor(cssForegroundColor),
      background: getKnownColor(cssBackgroundColor),
    };
  };

  useEffect(() => {
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

    const initialForegroundColor: KnownColor = cachedTheme?.[selectedItem]?.foreground ?? 'White';
    const initialBackgroundColor: KnownColor = cachedTheme?.[selectedItem]?.background ?? 'Blue';
    const initialColors: ChosenColors = {
      [selectedItem]: {
        foreground: initialForegroundColor,
        background: initialBackgroundColor,
      },
    };

    setSelectedForeground(initialForegroundColor);
    setSelectedBackground(initialBackgroundColor);
    setOriginalColors(initialColors);

    itemRef.current?.reselect(selectedItem);
    foregroundColorRef.current?.reselect(initialForegroundColor);
    backgroundColorRef.current?.reselect(initialBackgroundColor);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only update selections when the dialog opens
  }, [open]);

  return (
    <Dialog open={open} title="Colors" onCancel={cancelHandler}>
      <div className={styles.settings}>
        <div>
          <div>Item:</div>
          <OptionsList
            ref={itemRef}
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
        <button type="button" className={styles.active} onClick={okayHandler}>
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
        <button
          type="button"
          onClick={(e) => openDialog({ type: 'color-help', toFocusOnClose: e.currentTarget })}
        >
          Help
        </button>
      </DialogButtons>
    </Dialog>
  );
}
