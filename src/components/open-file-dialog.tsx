import { useCallback, useState } from 'react';

import { useKeyDownHandler } from '../hooks/useKeyDownHandler';
import { Dialog, DialogType, OpenDialogArgs } from './dialog';
import { DialogButtons } from './dialog-buttons';
import styles from './open-file-dialog.module.css';
import { OptionsList } from './option-list';

type OpenFileDialogParams = {
  open: boolean;
  openFile: (filename: string) => Promise<void>;
  openDialog: <T extends DialogType>({ type, toFocusOnClose }: OpenDialogArgs<T>) => void;
  closeDialog: () => void;
};

const defaultFiles: Array<string> = [
  'art.html',
  'index.html',
  'bio.html',
  'resume.html',
  'socials.html',
];

export function OpenFileDialog({
  open,
  openFile,
  closeDialog,
}: OpenFileDialogParams): React.JSX.Element {
  const [filter, setFilter] = useState('*.*');
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [files, _setFiles] = useState<Array<string>>(defaultFiles);

  const okayHandler = useCallback(() => {
    closeDialog();
    openFile(selectedFile);
  }, [closeDialog, openFile, selectedFile]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (!open) {
        return;
      }

      if (e.key === 'Enter') {
        okayHandler();
        e.preventDefault();
      }
    },
    [okayHandler, open],
  );

  useKeyDownHandler(handleKeyDown);

  return (
    <Dialog open={open} title="Open" closeDialog={closeDialog}>
      <div className={styles.open}>
        <label>
          <span>Filter:</span>
          <input
            type="text"
            defaultValue={filter}
            onChange={(e) => setFilter(e.currentTarget.value)}
          ></input>
        </label>
        <div>Files:</div>
        <OptionsList
          selectedOption={selectedFile}
          setSelectedOption={setSelectedFile}
          options={files.toSorted((a, b) => a.localeCompare(b))}
          onDoubleClick={okayHandler}
          filter={convertFilterToRegex(filter)}
        ></OptionsList>
      </div>

      <DialogButtons>
        <button type="button" onClick={okayHandler}>
          OK
        </button>
        <button type="button" onClick={() => closeDialog()}>
          Cancel
        </button>
      </DialogButtons>
    </Dialog>
  );
}

function convertFilterToRegex(pattern: string): RegExp {
  let regex = '';
  for (const c of [...pattern]) {
    switch (c) {
      case '*':
        regex += '.*';
        break;
      case '?':
        regex += '.';
        break;
      case '^': // escape character in cmd.exe
        regex += '\\';
        break;
      // escape special regexp-characters
      case '(':
      case ')':
      case '[':
      case ']':
      case '$':
      case '.':
      case '{':
      case '}':
      case '|':
      case '\\':
        regex += '\\';
        regex += c;
        break;
      default:
        regex += c;
        break;
    }
  }

  return new RegExp(regex);
}
