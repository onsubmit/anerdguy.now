import { colors, KnownColor } from './colors';

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

export const setCssVariable = (
  layer: 'foreground' | 'background',
  item: KnownThemeableItem,
  color: KnownColor,
): void => {
  document.documentElement.style.setProperty(
    `${cssVariableNames[item]}-${layer}`,
    `var(${colors[color].cssVariableName})`,
  );
};

type Theme = {
  [T in KnownThemeableItem]: {
    foreground: KnownColor;
    background: KnownColor;
  };
};

export const themeNames = ['Default', 'Hotdog Stand'] as const;
export type ThemeName = (typeof themeNames)[number];
export type Themes = Record<ThemeName, Theme>;

export const themes = {
  Default: {
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
  'Hotdog Stand': {
    'Normal Text': {
      foreground: 'Black',
      background: 'Yellow',
    },
    'Selected Text': {
      foreground: 'BrWhite',
      background: 'Black',
    },
    'Window Border': {
      foreground: 'Yellow',
      background: 'Red',
    },
    Menubar: {
      foreground: 'Black',
      background: 'BrWhite',
    },
    'Status Line': {
      foreground: 'Black',
      background: 'White',
    },
    Dialogs: {
      foreground: 'Black',
      background: 'Yellow',
    },
    'Dialog Titlebar': {
      foreground: 'Yellow',
      background: 'Red',
    },
    'Dialog Buttons': {
      foreground: 'Yellow',
      background: 'Red',
    },
  },
} as const satisfies Themes;
