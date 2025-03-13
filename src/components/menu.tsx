import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

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
  const topMenuItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [focusedMenuIndex, setFocusedMenuIndex] = useState<number | null>(null);

  const handleClickOutside = useCallback((e: MouseEvent): void => {
    if (e.target instanceof Node && !containerRef.current?.contains(e.target)) {
      setActiveMenuIndex(null);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (activeMenuIndex === null && focusedMenuIndex !== null) {
        if (containerRef.current?.contains(document.activeElement)) {
          let newIndex = -1;
          topMenuItemsRef.current[newIndex]?.focus();
          if (e.key === 'ArrowLeft') {
            newIndex = (focusedMenuIndex - 1) % menuItems.length;
          } else if (e.key === 'ArrowRight') {
            newIndex = (focusedMenuIndex + 1) % menuItems.length;
          } else {
            return;
          }

          topMenuItemsRef.current[newIndex]?.focus();
          setFocusedMenuIndex(newIndex);
        }
        return;
      }

      if (activeMenuIndex === null) {
        return;
      }

      let newIndex = -1;
      if (e.key === 'ArrowLeft') {
        newIndex = (activeMenuIndex - 1) % menuItems.length;
      } else if (e.key === 'ArrowRight') {
        newIndex = (activeMenuIndex + 1) % menuItems.length;
      } else {
        return;
      }

      setActiveMenuIndex(newIndex);
      topMenuItemsRef.current[newIndex]?.focus();
      setFocusedMenuIndex(newIndex);
    },
    [activeMenuIndex, focusedMenuIndex],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  function handleMenuClick(action: MenuAction): void {
    setActiveMenuIndex(null);

    if (isEditorOperation(action)) {
      if (action === 'find' || action === 'replace') {
        setCurrentDialog(action);
      } else {
        editorRef?.current?.[action]();
        editorRef?.current?.focus();
      }

      return;
    }

    if (isSettingAction(action)) {
      switch (action) {
        case 'open-colors-dialog': {
          return setCurrentDialog('color');
        }
        case 'open-about-dialog': {
          setCurrentDialog('about');
        }
      }
    }
  }

  function getSubItems(subItems: Array<MenuItem>): Array<React.JSX.Element> {
    const itemMaxLength = Math.max(...subItems.map(({ title }) => title.length));
    return subItems.map(({ title, keyCombo, action }) => {
      const value = keyCombo ? `${title.padEnd(itemMaxLength + 3, ' ')} ${keyCombo}` : title;
      return (
        <li
          key={title}
          onClick={() => handleMenuClick(action)}
          onMouseUp={() => handleMenuClick(action)}
        >
          <button
            type="button"
            onBlur={(e) => {
              if (!containerRef.current?.contains(e.relatedTarget)) {
                setActiveMenuIndex(null);
              }
            }}
          >
            {value}
          </button>
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
                ref={(el) => {
                  topMenuItemsRef.current[index] = el;
                }}
                onClick={() => setActiveMenuIndex(index)}
                onFocus={() => {
                  setFocusedMenuIndex(index);
                  console.log(index);

                  if (activeMenuIndex !== null) {
                    setActiveMenuIndex(index);
                  }
                }}
                onMouseDown={() => setActiveMenuIndex(activeMenuIndex !== index ? index : null)}
                onMouseOver={() => {
                  if (activeMenuIndex === null) {
                    return;
                  }

                  setActiveMenuIndex(index);
                }}
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
