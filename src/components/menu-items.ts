export type MenuItem = {
  title: string;
  subItems?: Array<MenuItem>;
  keyCombo?: string;
};

export const menuItems: Array<MenuItem> = [
  {
    title: 'File',
    subItems: [
      {
        title: 'New',
      },
      {
        title: 'Open...',
      },
      {
        title: 'Save',
      },
      {
        title: 'Save As...',
      },
      {
        title: 'Close',
      },
    ],
  },
  {
    title: 'Edit',
    subItems: [
      {
        title: 'Cut',
        keyCombo: 'Ctrl+X',
      },
      {
        title: 'Copy',
        keyCombo: 'Ctrl+C',
      },
      {
        title: 'Paste',
        keyCombo: 'Ctrl+V',
      },
      {
        title: 'Clear',
        keyCombo: 'Del',
      },
    ],
  },
  {
    title: 'Search',
    subItems: [
      {
        title: 'Find...',
      },
      {
        title: 'Repeat Last Find',
        keyCombo: 'F3',
      },
      {
        title: 'Replace',
      },
    ],
  },
  {
    title: 'View',
    subItems: [
      {
        title: 'Split Window',
        keyCombo: 'Ctrl+F6',
      },
      {
        title: 'Size Window',
        keyCombo: 'Ctrl+F8',
      },
      {
        title: 'Close Window',
        keyCombo: 'Ctrl+F4',
      },
    ],
  },
  {
    title: 'Options',
    subItems: [
      {
        title: 'Settings...',
      },
      {
        title: 'Colors...',
      },
    ],
  },
  {
    title: 'Help',
    subItems: [
      {
        title: 'Commands...',
      },
      {
        title: 'About...',
      },
    ],
  },
];
