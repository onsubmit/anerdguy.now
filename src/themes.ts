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

export const themeNames = [
  'Default',
  'Arizona',
  'Black Leather Jacket',
  'Designer',
  'Fluorescent',
  'Hotdog Stand',
  'Monochrome',
  'Ocean',
  'Plasma',
] as const;
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
  Arizona: {
    'Normal Text': {
      foreground: 'Black',
      background: 'BrWhite',
    },
    'Selected Text': {
      foreground: 'Black',
      background: 'Cyan',
    },
    'Window Border': {
      foreground: 'Black',
      background: 'Brown',
    },
    Menubar: {
      foreground: 'BrWhite',
      background: 'Cyan',
    },
    'Status Line': {
      foreground: 'Black',
      background: 'White',
    },
    Dialogs: {
      foreground: 'Black',
      background: 'BrWhite',
    },
    'Dialog Titlebar': {
      foreground: 'BrWhite',
      background: 'Cyan',
    },
    'Dialog Buttons': {
      foreground: 'BrWhite',
      background: 'Brown',
    },
  },
  'Black Leather Jacket': {
    'Normal Text': {
      foreground: 'Black',
      background: 'White',
    },
    'Selected Text': {
      foreground: 'BrWhite',
      background: 'Magenta',
    },
    'Window Border': {
      foreground: 'BrWhite',
      background: 'Gray',
    },
    Menubar: {
      foreground: 'BrWhite',
      background: 'Magenta',
    },
    'Status Line': {
      foreground: 'BrWhite',
      background: 'Black',
    },
    Dialogs: {
      foreground: 'Black',
      background: 'BrWhite',
    },
    'Dialog Titlebar': {
      foreground: 'BrWhite',
      background: 'Magenta',
    },
    'Dialog Buttons': {
      foreground: 'BrWhite',
      background: 'Magenta',
    },
  },
  Designer: {
    'Normal Text': {
      foreground: 'Black',
      background: 'White',
    },
    'Selected Text': {
      foreground: 'Black',
      background: 'Cyan',
    },
    'Window Border': {
      foreground: 'Black',
      background: 'BrWhite',
    },
    Menubar: {
      foreground: 'BrWhite',
      background: 'Cyan',
    },
    'Status Line': {
      foreground: 'BrWhite',
      background: 'Black',
    },
    Dialogs: {
      foreground: 'Black',
      background: 'BrWhite',
    },
    'Dialog Titlebar': {
      foreground: 'BrWhite',
      background: 'Cyan',
    },
    'Dialog Buttons': {
      foreground: 'BrWhite',
      background: 'Cyan',
    },
  },
  Fluorescent: {
    'Normal Text': {
      foreground: 'Black',
      background: 'BrWhite',
    },
    'Selected Text': {
      foreground: 'Black',
      background: 'Cyan',
    },
    'Window Border': {
      foreground: 'Black',
      background: 'BrGreen',
    },
    Menubar: {
      foreground: 'Black',
      background: 'Pink',
    },
    'Status Line': {
      foreground: 'BrWhite',
      background: 'Black',
    },
    Dialogs: {
      foreground: 'Black',
      background: 'BrWhite',
    },
    'Dialog Titlebar': {
      foreground: 'Black',
      background: 'Pink',
    },
    'Dialog Buttons': {
      foreground: 'Black',
      background: 'BrGreen',
    },
  },
  'Hotdog Stand': {
    'Normal Text': {
      foreground: 'Red',
      background: 'Yellow',
    },
    'Selected Text': {
      foreground: 'Yellow',
      background: 'Red',
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
  Monochrome: {
    'Normal Text': {
      foreground: 'Black',
      background: 'BrWhite',
    },
    'Selected Text': {
      foreground: 'Black',
      background: 'White',
    },
    'Window Border': {
      foreground: 'Black',
      background: 'BrWhite',
    },
    Menubar: {
      foreground: 'BrWhite',
      background: 'Black',
    },
    'Status Line': {
      foreground: 'Black',
      background: 'White',
    },
    Dialogs: {
      foreground: 'Black',
      background: 'BrWhite',
    },
    'Dialog Titlebar': {
      foreground: 'BrWhite',
      background: 'Black',
    },
    'Dialog Buttons': {
      foreground: 'Black',
      background: 'White',
    },
  },
  Ocean: {
    'Normal Text': {
      foreground: 'Black',
      background: 'Cyan',
    },
    'Selected Text': {
      foreground: 'Black',
      background: 'BrCyan',
    },
    'Window Border': {
      foreground: 'Black',
      background: 'White',
    },
    Menubar: {
      foreground: 'BrWhite',
      background: 'Blue',
    },
    'Status Line': {
      foreground: 'BrWhite',
      background: 'Black',
    },
    Dialogs: {
      foreground: 'Black',
      background: 'BrWhite',
    },
    'Dialog Titlebar': {
      foreground: 'BrWhite',
      background: 'Blue',
    },
    'Dialog Buttons': {
      foreground: 'BrWhite',
      background: 'Blue',
    },
  },
  Plasma: {
    'Normal Text': {
      foreground: 'BrWhite',
      background: 'Black',
    },
    'Selected Text': {
      foreground: 'Black',
      background: 'Pink',
    },
    'Window Border': {
      foreground: 'Black',
      background: 'Pink',
    },
    Menubar: {
      foreground: 'BrWhite',
      background: 'Blue',
    },
    'Status Line': {
      foreground: 'BrWhite',
      background: 'Black',
    },
    Dialogs: {
      foreground: 'Black',
      background: 'BrWhite',
    },
    'Dialog Titlebar': {
      foreground: 'Black',
      background: 'Pink',
    },
    'Dialog Buttons': {
      foreground: 'Black',
      background: 'Pink',
    },
  },
} as const satisfies Themes;
