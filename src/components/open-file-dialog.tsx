import { useState } from 'react';

import { Dialog, DialogType, OpenDialogArgs } from './dialog';
import { DialogButtons } from './dialog-buttons';
import { fileSystem } from './file-system';
import styles from './open-file-dialog.module.css';
import { OptionsList } from './option-list';

type OpenFileDialogParams = {
  open: boolean;
  openDialog: <T extends DialogType>({ type, toFocusOnClose }: OpenDialogArgs<T>) => void;
  closeDialog: () => void;
};

export function OpenFileDialog({ open, closeDialog }: OpenFileDialogParams): React.JSX.Element {
  const [filename, _setFilename] = useState('*.*');
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [files, _setFiles] = useState<Array<string>>(fileSystem['C:\\'].files.map((f) => f.name));
  const [folders, _setFolders] = useState<Array<string>>(
    fileSystem['C:\\'].folders.map((f) => f.name),
  );

  return (
    <Dialog open={open} title="Open" closeDialog={closeDialog}>
      <div className={styles.open}>
        <label>
          <span>File Name:</span>
          <input type="text" autoFocus={true} defaultValue={filename}></input>
        </label>
        <p>C:\WINDOWS</p>
        <div className={styles.fileSystem}>
          <div>
            <div>Files:</div>
            <OptionsList
              selectedOption={selectedFile}
              setSelectedOption={setSelectedFile}
              options={files}
            ></OptionsList>
          </div>
          <div>
            <div>Directories:</div>
            <OptionsList
              selectedOption={selectedFolder}
              setSelectedOption={setSelectedFolder}
              options={folders}
            ></OptionsList>
          </div>
        </div>
      </div>

      <DialogButtons>
        <button type="button" onClick={() => closeDialog()}>
          OK
        </button>
        <button type="button" onClick={() => closeDialog()}>
          Cancel
        </button>
        <button type="button">Help</button>
      </DialogButtons>
    </Dialog>
  );
}
