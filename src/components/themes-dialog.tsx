import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch } from '../hooks';
import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { getCachedItem, setCachedItem } from '../localStorage';
import { close } from '../slices/dialogSlice';
import {
  KnownThemeableItem,
  knownThemeableItems,
  setCssVariable,
  ThemeName,
  themeNames,
  themes,
} from '../themes';
import { ChosenColors } from './color-dialog';
import { Dialog } from './dialog';
import { DialogButtons } from './dialog-buttons';
import { OptionsList } from './option-list';
import styles from './themes-dialog.module.css';

type ThemesDialogParams = {
  open: boolean;
};

export function ThemesDialog({ open }: ThemesDialogParams): React.JSX.Element {
  const dispatch = useAppDispatch();

  const [selectedTheme, setSelectedTheme] = useState<ThemeName | 'Custom'>(
    getCachedItem('selectedTheme') ?? 'Custom',
  );
  const [pendingTheme, setPendingTheme] = useState<ThemeName | null>(null);
  const [originalTheme, setOriginalTheme] = useState<ThemeName | 'Custom'>(selectedTheme);
  const [originalColors, setOriginalColors] = useState<ChosenColors>(
    getCachedItem('theme') ?? themes.Default,
  );
  const [pendingColors, setPendingColors] = useState<ChosenColors>({});

  const okayHandler = useCallback(() => {
    setOriginalColors(pendingColors);
    setOriginalTheme(pendingTheme ?? 'Custom');
    setPendingTheme(null);
    setCachedItem('theme', pendingColors);
    dispatch(close(null));
  }, [dispatch, pendingColors, pendingTheme]);

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
    for (const [name, { foreground, background }] of Object.entries(originalColors)) {
      const item = name as KnownThemeableItem;
      if (foreground) {
        setCssVariable('foreground', item, foreground);
      }

      if (background) {
        setCssVariable('background', item, background);
      }
    }
    setSelectedTheme(originalTheme);
  }, [originalColors, originalTheme]);

  const applyTheme = (theme: ThemeName | 'Custom'): void => {
    if (theme === 'Custom') {
      return;
    }

    const colors: ChosenColors = {};
    for (const item of knownThemeableItems) {
      const { foreground, background } = (colors[item] = themes[theme][item]);
      setCssVariable('foreground', item, foreground);
      setCssVariable('background', item, background);
    }

    setPendingColors(colors);
    setPendingTheme(theme);
    setCachedItem('selectedTheme', theme);
  };

  useEffect(() => {
    const cachedSelectedTheme = getCachedItem('selectedTheme');
    if (open && cachedSelectedTheme && selectedTheme !== cachedSelectedTheme) {
      setSelectedTheme(cachedSelectedTheme);
    }
  }, [open, selectedTheme]);

  return (
    <Dialog open={open} title="Themes" onCancel={cancelHandler}>
      <div className={styles.open}>
        <OptionsList
          selectedOption={selectedTheme}
          setSelectedOption={setSelectedTheme}
          onSelectionChange={applyTheme}
          options={themeNames}
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
            dispatch(close(null));
          }}
        >
          Cancel
        </button>
      </DialogButtons>
    </Dialog>
  );
}
