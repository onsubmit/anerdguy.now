import { EditorOperationName } from './editor-operation';
import { FileAction } from './file-action';
import { SearchAction } from './search-action';
import { SettingAction } from './setting-action';

export type MenuAction =
  | 'open-sub-menu'
  | 'none'
  | FileAction
  | EditorOperationName
  | SettingAction
  | SearchAction;

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
        action: 'open',
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
        keyCombo: 'Ctrl+F',
        action: 'find',
      },
      {
        title: 'Repeat Last Find',
        keyCombo: 'F3',
        action: 'find-again',
      },
      {
        title: 'Replace',
        action: 'replace',
        keyCombo: 'Ctrl+R',
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
        action: 'open-about-dialog',
      },
    ],
  },
];
