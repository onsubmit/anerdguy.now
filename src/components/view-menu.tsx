import classNames from 'classnames';
import { useCallback, useRef } from 'react';

import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { useSubMenuFocusHandler } from '../hooks/useSubMenuFocusHandler';
import { SubMenuParams } from './sub-menu';
import styles from './sub-menu.module.css';

type ViewMenuParams = {
  openFile: (filename: string) => void;
  openFiles: Array<string>;
} & SubMenuParams;

export function ViewMenu({
  openFile,
  openFiles,
  open,
  closeMenu,
  ref,
}: ViewMenuParams): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  const setFocusedIndex = useSubMenuFocusHandler({ ref, listRef, disable: !open });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.altKey) {
        const number = parseInt(e.key, 10);
        if (number >= 1 && number <= 9 && openFiles[number - 1]) {
          e.preventDefault();
          openFile(openFiles[number - 1]);
        }
      }
    },
    [openFile, openFiles],
  );

  useKeyDownHandler(handleKeyDown);

  const getOpenFilesMenuItems = (): Array<React.JSX.Element> | undefined => {
    if (!openFiles.length) {
      return undefined;
    }

    const maxNameLength = Math.max('Split Window'.length, ...openFiles.map((f) => f.length));
    return openFiles.map((f, i) => (
      <li key={f}>
        <button
          type="button"
          onFocus={() => setFocusedIndex(3 + i)}
          onClick={() => {
            closeMenu();
            openFile(openFiles[i]);
          }}
        >
          {f.padEnd(maxNameLength, ' ') + '    ' + (i < 9 ? `Alt+${i + 1}` : '')}
        </button>
      </li>
    ));
  };

  return (
    <div className={classNames(styles.subMenu, open ? styles.open : undefined)}>
      <ul ref={listRef}>
        <li>
          <button type="button" onFocus={() => setFocusedIndex(0)}>
            {`Split Window    Ctrl+F6`}
          </button>
        </li>
        <li>
          <button type="button" onFocus={() => setFocusedIndex(1)}>
            {`Size Window     Ctrl+F8`}
          </button>
        </li>
        <li>
          <button type="button" onFocus={() => setFocusedIndex(2)}>
            {`Close Window    Ctrl+F4`}
          </button>
          {openFiles.length ? <hr /> : undefined}
        </li>
        {getOpenFilesMenuItems()}
      </ul>
    </div>
  );
}
