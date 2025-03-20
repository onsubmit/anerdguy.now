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

export type ThemeableItems = {
  [T in KnownThemeableItem]: {
    cssVariableName: `--${string}`;
  };
};

export const cssVariableNames: Record<KnownThemeableItem, string> = {
  'Normal Text': '--normal-text',
  'Selected Text': '--selected-text',
  'Window Border': '--window-border',
  Menubar: '--menubar',
  'Status Line': '--status-line',
  Dialogs: '--dialogs',
  'Dialog Titlebar': '--dialog-titlebar',
  'Dialog Buttons': '--dialog-buttons',
};

type Theme = {
  [T in KnownThemeableItem]: {
    foreground: KnownColor;
    background: KnownColor;
  };
};

export const themeNames = ['default'] as const;
export type ThemeName = (typeof themeNames)[number];
export type Themes = Record<ThemeName, Theme>;

export const themes = {
  default: {
    'Normal Text': {
      foreground: 'White',
      background: 'Blue',
    },
    'Selected Text': {
      foreground: 'Black',
      background: 'White',
    },
    'Window Border': {
      foreground: 'White',
      background: 'Black',
    },
    Menubar: {
      foreground: 'Black',
      background: 'White',
    },
    'Status Line': {
      foreground: 'Black',
      background: 'White',
    },
    Dialogs: {
      foreground: 'Black',
      background: 'White',
    },
    'Dialog Titlebar': {
      foreground: 'Black',
      background: 'BrWhite',
    },
    'Dialog Buttons': {
      foreground: 'Black',
      background: 'BrWhite',
    },
  },
} as const satisfies Themes;
