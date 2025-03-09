import { useState } from 'react';

import styles from './menu.module.css';

type MenuItem = {
  title: string;
  subItems?: Array<MenuItem>;
};

const menuItems: Array<MenuItem> = [
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
  },
  {
    title: 'Search',
  },
  {
    title: 'View',
  },
  {
    title: 'Options',
  },
  {
    title: 'Help',
  },
];

export function Menu(): React.JSX.Element {
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);

  return (
    <div className={styles.menu}>
      <ul>
        {menuItems.map(({ title, subItems }, index) => (
          <li className={activeMenuIndex === index ? styles.active : undefined}>
            <button
              type="button"
              onClick={() => setActiveMenuIndex(activeMenuIndex !== index ? index : null)}
            >
              {title}
            </button>
            {activeMenuIndex === index && subItems ? (
              <div className={styles.subMenu}>
                <ul>
                  {subItems.map(({ title }) => (
                    <li>
                      <button type="button">{title}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : undefined}
          </li>
        ))}
      </ul>
    </div>
  );
}
