import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

import { DialogType } from './dialog';
import { EditorOperations, isEditorOperation } from './editor-operation';
import { FindDialogOperations } from './find-dialog';
import styles from './menu.module.css';
import { MenuAction, MenuItem, menuItems } from './menu-items';
import { isSearchAction } from './search-action';
import { isSettingAction } from './setting-action';

type MenuParams = {
  editorRef: RefObject<EditorOperations | null>;
  findDialogRef: RefObject<FindDialogOperations | null>;
  openDialog: (type: DialogType) => void;
};

export function Menu({ editorRef, findDialogRef, openDialog }: MenuParams): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const topMenuItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const subMenuItemsRef = useRef<Record<number, Array<HTMLButtonElement | null>>>({});
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [focusedMenuIndex, setFocusedMenuIndex] = useState<number | null>(null);
  const [focusedSubMenuIndex, setFocusedSubMenuIndex] = useState<number | null>(null);

  const handleClickOutside = useCallback((e: MouseEvent): void => {
    if (e.target instanceof Node && !containerRef.current?.contains(e.target)) {
      setActiveMenuIndex(null);
      setFocusedSubMenuIndex(null);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === 'F3') {
        findDialogRef.current?.findAgain();
        e.preventDefault();
        return;
      }

      if (activeMenuIndex === null && focusedMenuIndex !== null) {
        if (containerRef.current?.contains(document.activeElement)) {
          let newIndex = -1;
          if (e.key === 'ArrowLeft') {
            newIndex = focusedMenuIndex === 0 ? menuItems.length - 1 : focusedMenuIndex - 1;
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

      if (e.key === 'Escape') {
        topMenuItemsRef.current[activeMenuIndex]?.focus();
        setFocusedMenuIndex(activeMenuIndex);

        setActiveMenuIndex(null);
        setFocusedSubMenuIndex(null);
      }

      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        let newIndex = -1;
        if (e.key === 'ArrowLeft') {
          newIndex = activeMenuIndex === 0 ? menuItems.length - 1 : activeMenuIndex - 1;
        } else if (e.key === 'ArrowRight') {
          newIndex = (activeMenuIndex + 1) % menuItems.length;
        }

        setActiveMenuIndex(newIndex);
        topMenuItemsRef.current[newIndex]?.focus();
        setFocusedMenuIndex(newIndex);
      } else if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
        let newIndex = -1;
        if (e.key === 'ArrowDown') {
          newIndex =
            focusedSubMenuIndex === null
              ? 0
              : focusedSubMenuIndex === subMenuItemsRef.current[activeMenuIndex].length - 1
                ? 0
                : focusedSubMenuIndex + 1;
        } else if (e.key === 'ArrowUp') {
          newIndex = !focusedSubMenuIndex
            ? subMenuItemsRef.current[activeMenuIndex].length - 1
            : focusedSubMenuIndex - 1;
        }

        subMenuItemsRef.current[activeMenuIndex][newIndex]?.focus();
      }
    },
    [activeMenuIndex, findDialogRef, focusedMenuIndex, focusedSubMenuIndex],
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
    setFocusedSubMenuIndex(null);

    if (isEditorOperation(action)) {
      if (action === 'find' || action === 'replace') {
        openDialog(action);
      } else {
        editorRef?.current?.[action]();
        editorRef?.current?.focus();
      }

      return;
    }

    if (isSearchAction(action)) {
      switch (action) {
        case 'find-again': {
          findDialogRef.current?.findAgain();
        }
      }
    }

    if (isSettingAction(action)) {
      switch (action) {
        case 'open-colors-dialog': {
          return openDialog('color');
        }
        case 'open-about-dialog': {
          openDialog('about');
        }
      }
    }
  }

  function getSubItems(subItems: Array<MenuItem>, topMenuIndex: number): Array<React.JSX.Element> {
    const itemMaxLength = Math.max(...subItems.map(({ title }) => title.length));
    return subItems.map(({ title, keyCombo, action }, index) => {
      const value = keyCombo ? `${title.padEnd(itemMaxLength + 3, ' ')} ${keyCombo}` : title;
      return (
        <li
          key={title}
          onClick={() => handleMenuClick(action)}
          onMouseUp={() => handleMenuClick(action)}
        >
          <button
            type="button"
            ref={(el) => {
              if (!subMenuItemsRef.current[topMenuIndex]) {
                subMenuItemsRef.current[topMenuIndex] = [];
              }

              subMenuItemsRef.current[topMenuIndex][index] = el;
            }}
            onFocus={() => {
              setFocusedSubMenuIndex(index);
            }}
            onBlur={(e) => {
              e.preventDefault();
              // TODO: Track down what's setting the state while the Dialog component renders
              setTimeout(() => {
                if (!containerRef.current?.contains(e.relatedTarget)) {
                  setActiveMenuIndex(null);
                  setFocusedSubMenuIndex(null);
                }
              });
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
                onClick={() => {
                  setFocusedSubMenuIndex(null);
                  if (activeMenuIndex !== null) {
                    setActiveMenuIndex(activeMenuIndex === index ? null : index);
                  } else {
                    setActiveMenuIndex(index);
                  }
                }}
                onFocus={() => {
                  setFocusedMenuIndex(index);

                  if (activeMenuIndex !== null) {
                    setActiveMenuIndex(index);
                    setFocusedSubMenuIndex(null);
                  }
                }}
                onMouseOver={() => {
                  if (activeMenuIndex === null) {
                    return;
                  }

                  setActiveMenuIndex(index);
                  setFocusedSubMenuIndex(null);
                }}
              >
                {title}
              </button>
              {item.action === 'open-sub-menu' && activeMenuIndex === index && item.subItems ? (
                <div className={styles.subMenu}>
                  <ul>{getSubItems(item.subItems, index)}</ul>
                </div>
              ) : undefined}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
