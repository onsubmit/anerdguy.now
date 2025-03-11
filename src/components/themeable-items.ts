import { KnownColor } from './colors';

export const knownThemeableItems = [
  'Normal Text',
  'Selected Text',
  'Window Border',
  'Menubar',
  'Status Line',
  'Dialogs',
  'Dialog Titlebar',
  'Dialog Buttons',
] as const;

export type KnownThemeableItem = (typeof knownThemeableItems)[number];

type ThemeableItems = {
  [T in KnownThemeableItem]: {
    cssVariableName: `--${string}`;
    defaults: {
      foreground: KnownColor;
      background: KnownColor;
    };
  };
};

export const themeableItems: ThemeableItems = {
  'Normal Text': {
    cssVariableName: '--normal-text',
    defaults: {
      foreground: 'White',
      background: 'Blue',
    },
  },
  'Selected Text': {
    cssVariableName: '--selected-text',
    defaults: {
      foreground: 'Black',
      background: 'White',
    },
  },
  'Window Border': {
    cssVariableName: '--window-border',
    defaults: {
      foreground: 'White',
      background: 'Black',
    },
  },
  Menubar: {
    cssVariableName: '--menubar',
    defaults: {
      foreground: 'Black',
      background: 'White',
    },
  },
  'Status Line': {
    cssVariableName: '--status-line',
    defaults: {
      foreground: 'Black',
      background: 'White',
    },
  },
  Dialogs: {
    cssVariableName: '--dialogs',
    defaults: {
      foreground: 'Black',
      background: 'White',
    },
  },
  'Dialog Titlebar': {
    cssVariableName: '--dialog-titlebar',
    defaults: {
      foreground: 'White',
      background: 'BrWhite',
    },
  },
  'Dialog Buttons': {
    cssVariableName: '--dialog-buttons',
    defaults: {
      foreground: 'Black',
      background: 'BrWhite',
    },
  },
};
