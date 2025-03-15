import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

import { DialogType } from './dialog';
import { EditMenu } from './edit-menu';
import { EditorMode } from './editor';
import { FileMenu } from './file-menu';
import { FindDialogOperations } from './find-dialog';
import { HelpMenu } from './help-menu';
import styles from './menu.module.css';
import { OptionsMenu } from './options-menu';
import { SearchMenu } from './search-menu';
import { ViewMenu } from './view-menu';

const menus = [
  { title: 'File', SubMenu: FileMenu },
  { title: 'Edit', SubMenu: EditMenu },
  { title: 'Search', SubMenu: SearchMenu },
  { title: 'View', SubMenu: ViewMenu },
  { title: 'Options', SubMenu: OptionsMenu },
  { title: 'Help', SubMenu: HelpMenu },
];

type MenuParams = {
  editorMode: EditorMode;
  toggleEditorMode: () => void;
  openDialog: (type: DialogType, toFocusOnClose?: HTMLElement | null) => void;
  findDialogRef: RefObject<FindDialogOperations | null>;
};

export function Menu2({
  editorMode,
  toggleEditorMode,
  openDialog,
  findDialogRef,
}: MenuParams): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const topMenuItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [focusedMenuIndex, setFocusedMenuIndex] = useState<number | null>(null);

  const activate = (title: string): void => {
    const index = menus.findIndex((m) => m.title === title);
    setActiveMenuIndex(index < 0 ? null : index);
  };

  const closeMenu = (): void => {
    setActiveMenuIndex(null);
  };

  const closeMenuAndOpenDialog = (type: DialogType, toFocusOnClose?: HTMLElement | null): void => {
    closeMenu();
    openDialog(type, toFocusOnClose);
  };

  const handleClickOutside = useCallback((e: MouseEvent): void => {
    if (e.target instanceof Node && !containerRef.current?.contains(e.target)) {
      closeMenu();
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === 'F3') {
        findDialogRef.current?.findAgain();
        e.preventDefault();
        return;
      }

      if (e.ctrlKey && ['f', 'r'].includes(e.key)) {
        openDialog(e.key === 'f' ? 'find' : 'replace');
        e.preventDefault();
        return;
      }

      if (activeMenuIndex === null && focusedMenuIndex !== null) {
        if (containerRef.current?.contains(document.activeElement)) {
          let newIndex = -1;
          if (e.key === 'ArrowLeft') {
            newIndex = focusedMenuIndex === 0 ? menus.length - 1 : focusedMenuIndex - 1;
          } else if (e.key === 'ArrowRight') {
            newIndex = (focusedMenuIndex + 1) % menus.length;
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

        closeMenu();
        //setFocusedSubMenuIndex(null);
      }

      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        let newIndex = -1;
        if (e.key === 'ArrowLeft') {
          newIndex = activeMenuIndex === 0 ? menus.length - 1 : activeMenuIndex - 1;
        } else if (e.key === 'ArrowRight') {
          newIndex = (activeMenuIndex + 1) % menus.length;
        }

        setActiveMenuIndex(newIndex);
        topMenuItemsRef.current[newIndex]?.focus();
        setFocusedMenuIndex(newIndex);
      } else if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
        // let newIndex = -1;
        // if (e.key === 'ArrowDown') {
        //   newIndex =
        //     focusedSubMenuIndex === null
        //       ? 0
        //       : focusedSubMenuIndex === subMenuItemsRef.current[activeMenuIndex].length - 1
        //         ? 0
        //         : focusedSubMenuIndex + 1;
        // } else if (e.key === 'ArrowUp') {
        //   newIndex = !focusedSubMenuIndex
        //     ? subMenuItemsRef.current[activeMenuIndex].length - 1
        //     : focusedSubMenuIndex - 1;
        // }
        // subMenuItemsRef.current[activeMenuIndex][newIndex]?.focus();
      }
    },
    [activeMenuIndex, findDialogRef, focusedMenuIndex, openDialog],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div ref={containerRef} className={styles.menu}>
      <ul>
        {menus.map(({ title, SubMenu }, index) => (
          <li>
            <button
              ref={(el) => {
                topMenuItemsRef.current[index] = el;
              }}
              type="button"
              onClick={() => activate(title)}
              onFocus={() => {
                setFocusedMenuIndex(index);

                if (activeMenuIndex !== null) {
                  setActiveMenuIndex(index);
                }
              }}
              onMouseOver={() => {
                if (activeMenuIndex !== null && menus[activeMenuIndex].title !== title) {
                  activate(title);
                }
              }}
            >
              {title}
            </button>
            {activeMenuIndex !== null && menus[activeMenuIndex].title === title ? (
              <SubMenu
                topMenuButton={topMenuItemsRef.current[index]}
                closeMenu={closeMenu}
                openDialog={closeMenuAndOpenDialog}
                editorMode={editorMode}
                toggleEditorMode={toggleEditorMode}
              />
            ) : undefined}
          </li>
        ))}
      </ul>
    </div>
  );
}
