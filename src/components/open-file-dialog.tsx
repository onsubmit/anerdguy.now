import { useState } from 'react';

import { Dialog, DialogType } from './dialog';
import { DialogButtons } from './dialog-buttons';
import { fileSystem } from './file-system';
import styles from './open-file-dialog.module.css';
import { OptionsList } from './option-list';

type OpenFileDialogParams = {
  open: boolean;
  openDialog: (type: DialogType, opener: HTMLElement) => void;
  closeDialog: () => void;
};

export function OpenFileDialog({
  open,
  openDialog,
  closeDialog,
}: OpenFileDialogParams): React.JSX.Element {
  const [filename, setFilename] = useState('*.*');
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [files, setFiles] = useState<Array<string>>(fileSystem['C:\\'].files);
  const [folders, setFolders] = useState<Array<string>>(
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
