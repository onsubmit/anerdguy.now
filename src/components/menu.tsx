import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { DialogType, OpenDialogArgs } from './dialog';
import { EditMenu } from './edit-menu';
import { EditorMode } from './editor';
import { EditorOperations } from './editor-operation';
import { FileMenu } from './file-menu';
import { FindDialogOperations } from './find-dialog';
import { HelpMenu } from './help-menu';
import styles from './menu.module.css';
import { OptionsMenu } from './options-menu';
import { SearchMenu } from './search-menu';
import { SubMenuParams } from './sub-menu';
import { ViewMenu } from './view-menu';

type MenuParams = {
  editorMode: EditorMode;
  toggleEditorMode: () => void;
  openFile: (filename: string) => void;
  closeFile: () => void;
  saveFile: () => void;
  revertFile: () => void;
  openFiles: Array<string>;
  openDialog: <T extends DialogType>(args: OpenDialogArgs<T>) => void;
  findDialogRef: RefObject<FindDialogOperations | null>;
  editorRef: RefObject<EditorOperations | null>;
};

export function Menu({
  editorMode,
  toggleEditorMode,
  openFile,
  closeFile,
  saveFile,
  revertFile,
  openFiles,
  openDialog,
  findDialogRef,
  editorRef,
}: MenuParams): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const topMenuItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [focusedMenuIndex, setFocusedMenuIndex] = useState<number | null>(null);

  const closeMenu = useCallback((): void => {
    if (activeMenuIndex) {
      subMenuRefs.current[activeMenuIndex]?.reset();
    }

    setActiveMenuIndex(null);
  }, [activeMenuIndex]);

  const getSubMenuParams = useCallback(
    (index: number): SubMenuParams => ({
      ref: (el) => (subMenuRefs.current[index] = el),
      open: activeMenuIndex === index,
      topMenuButton: topMenuItemsRef.current[index],
      closeMenu,
      openDialog: <T extends DialogType>(args: OpenDialogArgs<T>): void => {
        closeMenu();
        openDialog(args);
      },
    }),
    [activeMenuIndex, closeMenu, openDialog],
  );

  const subMenuRefs = useRef<Array<{ reset: () => void } | null>>([]);

  const menus = useMemo(
    () => [
      {
        title: 'File',
        component: (
          <FileMenu
            {...{
              ...getSubMenuParams(0),
              closeFile,
              saveFile,
              revertFile,
              disableClose: openFiles.length === 1,
              editorMode,
              toggleEditorMode,
              activeMenuIndex,
            }}
          ></FileMenu>
        ),
      },
      {
        title: 'Edit',
        component: <EditMenu {...{ ...getSubMenuParams(1), editorMode, editorRef }}></EditMenu>,
      },
      {
        title: 'Search',
        component: (
          <SearchMenu
            disableReplace={editorMode === 'view'}
            {...{ ...getSubMenuParams(2), editorMode, findDialogRef }}
          ></SearchMenu>
        ),
      },
      {
        title: 'View',
        component: <ViewMenu {...{ ...getSubMenuParams(3), openFile, openFiles }}></ViewMenu>,
      },
      {
        title: 'Options',
        component: <OptionsMenu {...{ ...getSubMenuParams(4) }}></OptionsMenu>,
      },
      {
        title: 'Help',
        component: <HelpMenu {...{ ...getSubMenuParams(5) }}></HelpMenu>,
      },
    ],
    [
      activeMenuIndex,
      closeFile,
      editorMode,
      editorRef,
      findDialogRef,
      getSubMenuParams,
      openFile,
      openFiles,
      revertFile,
      saveFile,
      toggleEditorMode,
    ],
  );

  const activate = (title: string): void => {
    const index = menus.findIndex((m) => m.title === title);
    if (activeMenuIndex) {
      subMenuRefs.current[activeMenuIndex]?.reset();
    }
    setActiveMenuIndex(index < 0 ? null : index);
  };

  const handleClickOutside = useCallback(
    (e: MouseEvent): void => {
      if (e.target instanceof Node && !containerRef.current?.contains(e.target)) {
        closeMenu();
      }
    },
    [closeMenu],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        if (activeMenuIndex !== null) {
          topMenuItemsRef.current[activeMenuIndex]?.focus();
          setFocusedMenuIndex(activeMenuIndex);
          closeMenu();
        }

        return;
      }

      if (activeMenuIndex === null && focusedMenuIndex !== null) {
        if (containerRef.current?.contains(document.activeElement)) {
          let newIndex = -1;
          if (e.key === 'ArrowLeft') {
            newIndex = focusedMenuIndex === 0 ? menus.length - 1 : focusedMenuIndex - 1;
          } else if (e.key === 'ArrowRight') {
            newIndex = (focusedMenuIndex + 1) % menus.length;
          } else if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
            if (activeMenuIndex === null) {
              setActiveMenuIndex(focusedMenuIndex);
            }
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

      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        let newIndex = -1;
        if (e.key === 'ArrowLeft') {
          newIndex = activeMenuIndex === 0 ? menus.length - 1 : activeMenuIndex - 1;
        } else if (e.key === 'ArrowRight') {
          newIndex = (activeMenuIndex + 1) % menus.length;
        }

        if (activeMenuIndex) {
          subMenuRefs.current[activeMenuIndex]?.reset();
        }

        setActiveMenuIndex(newIndex);
        topMenuItemsRef.current[newIndex]?.focus();
        setFocusedMenuIndex(newIndex);
      }
    },
    [activeMenuIndex, closeMenu, focusedMenuIndex, menus.length],
  );

  useKeyDownHandler(handleKeyDown);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <div ref={containerRef} className={styles.menu}>
      <ul>
        {menus.map(({ title, component }, index) => (
          <li key={title} className={activeMenuIndex === index ? styles.active : undefined}>
            <button
              ref={(el) => {
                topMenuItemsRef.current[index] = el;
              }}
              type="button"
              onClick={() => activate(title)}
              onFocus={() => {
                setFocusedMenuIndex(index);

                if (activeMenuIndex !== null) {
                  subMenuRefs.current[activeMenuIndex]?.reset();
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
            {component}
          </li>
        ))}
      </ul>
    </div>
  );
}
