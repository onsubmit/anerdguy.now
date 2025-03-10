import { useState } from 'react';

import styles from './color-dialog.module.css';
import { ColorOptionList } from './color-option-list';
import { OptionsList } from './option-list';

type ColorDialogParams = {
  setCurrentDialog: React.Dispatch<React.SetStateAction<'color' | null>>;
};

export function ColorDialog({ setCurrentDialog }: ColorDialogParams): React.JSX.Element {
  const [selectedItem, setSelectedItem] = useState('Normal Text');
  const [selectedForeground, setSelectedForeground] = useState('White');
  const [selectedBackground, setSelectedBackground] = useState('Blue');

  return (
    <dialog className={styles.dialog} open>
      <div className={styles.title}>Colors</div>
      <div className={styles.settings}>
        <div>
          <div>Item:</div>
          <OptionsList
            selectedOption={selectedItem}
            setSelectedOption={setSelectedItem}
            options={[
              'Normal Text',
              'Selected Text',
              'Window Border',
              'Menubar',
              'Status Line',
              'Keyboard Accelerators',
              'Disabled Items',
              'Dialogs',
              'Dialog Titlebar',
              'Dialog Buttons',
              'Dialog Scrollbars',
            ]}
          ></OptionsList>
        </div>
        <div>
          <div>Foreground:</div>
          <ColorOptionList
            selectedColor={selectedForeground}
            setSelectedColor={setSelectedForeground}
          ></ColorOptionList>
        </div>
        <div>
          <div>Background:</div>
          <ColorOptionList
            selectedColor={selectedBackground}
            setSelectedColor={setSelectedBackground}
          ></ColorOptionList>
        </div>
      </div>
      <div className={styles.sample}>Choose the colors for the item</div>
      <div className={styles.buttons}>
        <button type="button">Default</button>
        <button type="button" className={styles.active} onClick={() => setCurrentDialog(null)}>
          OK
        </button>
        <button type="button" onClick={() => setCurrentDialog(null)}>
          Cancel
        </button>
        <button type="button">Help</button>
      </div>
    </dialog>
  );
}
