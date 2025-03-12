import { RefObject, useEffect, useRef, useState } from 'react';

import { DialogType } from './dialog';
import { EditorOperations, isEditorOperation } from './editor-operation';
import styles from './menu.module.css';
import { MenuAction, MenuItem, menuItems } from './menu-items';
import { isSettingAction } from './setting-action';

type MenuParams = {
  editorRef: RefObject<EditorOperations | null>;
  setCurrentDialog: React.Dispatch<React.SetStateAction<DialogType | null>>;
};

export function Menu({ editorRef, setCurrentDialog }: MenuParams): React.JSX.Element {
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
    setActiveMenuIndex(null);

    if (isEditorOperation(action)) {
      editorRef?.current?.[action]();
      editorRef?.current?.focus();
      return;
    }

    if (isSettingAction(action)) {
      switch (action) {
        case 'open-colors-dialog': {
          setCurrentDialog('color');
        }
      }
    }
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
