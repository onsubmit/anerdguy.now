import { useState } from 'react';

import styles from './menu.module.css';
import { MenuItem, menuItems } from './menu-items';

export function Menu(): React.JSX.Element {
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);

  function getSubItems(subItems: Array<MenuItem>): Array<React.JSX.Element> {
    const itemMaxLength = Math.max(...subItems.map(({ title }) => title.length));
    return subItems.map(({ title, keyCombo }) => {
      const value = keyCombo ? `${title.padEnd(itemMaxLength + 3, ' ')} ${keyCombo}` : title;
      return (
        <li>
          <button type="button">{value}</button>
        </li>
      );
    });
  }

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
                <ul>{getSubItems(subItems)}</ul>
              </div>
            ) : undefined}
          </li>
        ))}
      </ul>
    </div>
  );
}
