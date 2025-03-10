import { RefObject, useEffect, useRef, useState } from 'react';

import { EditorOperations, isEditorOperation } from './editor-operation';
import styles from './menu.module.css';
import { MenuAction, MenuItem, menuItems } from './menu-items';

type MenuParams = {
  editorRef: RefObject<EditorOperations | null>;
};

export function Menu({ editorRef }: MenuParams): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);

  const handleClickOutside = (e: MouseEvent): void => {
    if (e.target instanceof Node && !containerRef.current?.contains(e.target)) {
      setActiveMenuIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return (): void => document.removeEventListener('mousedown', handleClickOutside);
  });

  function handleMenuClick(action: MenuAction): void {
    const file = editorRef?.current;
    if (!file || !isEditorOperation(action)) return;

    file[action]();
    setActiveMenuIndex(null);
    editorRef?.current?.focus();
  }

  function getSubItems(subItems: Array<MenuItem>): Array<React.JSX.Element> {
    const itemMaxLength = Math.max(...subItems.map(({ title }) => title.length));
    return subItems.map(({ title, keyCombo, action }) => {
      const value = keyCombo ? `${title.padEnd(itemMaxLength + 3, ' ')} ${keyCombo}` : title;
      return (
        <li key={title} onClick={(_) => handleMenuClick(action)}>
          <button type="button">{value}</button>
        </li>
      );
    });
  }

  return (
    <div ref={containerRef} className={styles.menu}>
      <ul>
        {menuItems.map((item, index) => {
          const { title } = item;

          return (
            <li key={title} className={activeMenuIndex === index ? styles.active : undefined}>
              <button
                type="button"
                onClick={() => setActiveMenuIndex(activeMenuIndex !== index ? index : null)}
              >
                {title}
              </button>
              {item.action === 'open-sub-menu' && activeMenuIndex === index && item.subItems ? (
                <div className={styles.subMenu}>
                  <ul>{getSubItems(item.subItems)}</ul>
                </div>
              ) : undefined}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
