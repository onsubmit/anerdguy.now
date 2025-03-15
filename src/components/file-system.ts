type Folder = {
  name: string;
  folders: Array<Folder>;
  files: Array<string>;
};

type FileSystem = {
  'C:\\': Folder;
};

export const fileSystem: FileSystem = {
  'C:\\': {
    name: 'C:\\',
    folders: [
      {
        name: 'My Documents',
        folders: [],
        files: ['test.txt'],
      },
    ],
    files: ['AUTOEXEC.BAT', 'SCANDISK.LOG'],
  },
};
