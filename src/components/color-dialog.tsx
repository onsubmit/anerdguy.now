import { RefObject } from 'react';

import styles from './color-dialog.module.css';

export function ColorDialog({
  ref,
}: {
  ref: RefObject<HTMLDialogElement | null>;
}): React.JSX.Element {
  return (
    <dialog ref={ref} className={styles.dialog}>
      <div className={styles.title}>Colors</div>
      <div className={styles.settings}>
        <div>
          <div>Item:</div>
          <ul>
            <li>Normal Text</li>
            <li>Selected Text</li>
            <li>Window Border</li>
            <li>Menubar</li>
            <li>Status Line</li>
            <li>Keyboard Accelerators</li>
            <li>Disabled Items</li>
            <li>Dialogs</li>
            <li>Dialog Titlebar</li>
            <li>Dialog Buttons</li>
            <li>Dialog Scrollbars</li>
          </ul>
        </div>
        <div>
          <div>Foreground:</div>
          <ul>
            <li>Black</li>
            <li>Blue</li>
            <li>Green</li>
            <li>Cyan</li>
            <li>Red</li>
            <li>Magenta</li>
            <li>Brown</li>
            <li>White</li>
            <li>Gray</li>
            <li>BrBlue</li>
            <li>BrGreen</li>
            <li>BrCyan</li>
            <li>BrRed</li>
            <li>Pink</li>
            <li>Yellow</li>
            <li>BrWhite</li>
          </ul>
        </div>
        <div>
          <div>Background:</div>
          <ul>
            <li>Black</li>
            <li>Blue</li>
            <li>Green</li>
            <li>Cyan</li>
            <li>Red</li>
            <li>Magenta</li>
            <li>Brown</li>
            <li>White</li>
            <li>Gray</li>
            <li>BrBlue</li>
            <li>BrGreen</li>
            <li>BrCyan</li>
            <li>BrRed</li>
            <li>Pink</li>
            <li>Yellow</li>
            <li>BrWhite</li>
          </ul>
        </div>
      </div>
      <div className={styles.sample}>Choose the colors for the item</div>
      <div className={styles.buttons}>
        <button type="button">Default</button>
        <button type="button" className={styles.active} onClick={() => ref.current?.close()}>
          OK
        </button>
        <button type="button" onClick={() => ref.current?.close()}>
          Cancel
        </button>
        <button type="button">Help</button>
      </div>
    </dialog>
  );
}
