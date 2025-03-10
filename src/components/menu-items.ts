import { EditorOperationName } from './editor-operation';
import { SettingAction } from './setting-action';

export type MenuAction = 'open-sub-menu' | 'none' | EditorOperationName | SettingAction;

export type MenuItem = {
  title: string;
  keyCombo?: string;
} & (
  | {
      action: 'open-sub-menu';
      subItems: Array<MenuItem>;
    }
  | {
      action: Exclude<MenuAction, 'open-sub-menu'>;
    }
);

export const menuItems: Array<MenuItem> = [
  {
    title: 'File',
    action: 'open-sub-menu',
    subItems: [
      {
        title: 'New',
        action: 'none',
      },
      {
        title: 'Open...',
        action: 'none',
      },
      {
        title: 'Save',
        action: 'none',
      },
      {
        title: 'Save As...',
        action: 'none',
      },
      {
        title: 'Close',
        action: 'none',
      },
    ],
  },
  {
    title: 'Edit',
    action: 'open-sub-menu',
    subItems: [
      {
        title: 'Cut',
        keyCombo: 'Ctrl+X',
        action: 'cut',
      },
      {
        title: 'Copy',
        keyCombo: 'Ctrl+C',
        action: 'copy',
      },
      {
        title: 'Paste',
        keyCombo: 'Ctrl+V',
        action: 'paste',
      },
      {
        title: 'Clear',
        keyCombo: 'Del',
        action: 'delete',
      },
    ],
  },
  {
    title: 'Search',
    action: 'open-sub-menu',
    subItems: [
      {
        title: 'Find...',
        action: 'none',
      },
      {
        title: 'Repeat Last Find',
        keyCombo: 'F3',
        action: 'none',
      },
      {
        title: 'Replace',
        action: 'none',
      },
    ],
  },
  {
    title: 'View',
    action: 'open-sub-menu',
    subItems: [
      {
        title: 'Split Window',
        keyCombo: 'Ctrl+F6',
        action: 'none',
      },
      {
        title: 'Size Window',
        keyCombo: 'Ctrl+F8',
        action: 'none',
      },
      {
        title: 'Close Window',
        keyCombo: 'Ctrl+F4',
        action: 'none',
      },
    ],
  },
  {
    title: 'Options',
    action: 'open-sub-menu',
    subItems: [
      {
        title: 'Settings...',
        action: 'none',
      },
      {
        title: 'Colors...',
        action: 'open-colors-dialog',
      },
    ],
  },
  {
    title: 'Help',
    action: 'open-sub-menu',
    subItems: [
      {
        title: 'Commands...',
        action: 'none',
      },
      {
        title: 'About...',
        action: 'none',
      },
    ],
  },
];
