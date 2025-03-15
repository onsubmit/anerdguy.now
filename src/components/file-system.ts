type File = {
  name: string;
  includeFile: string;
};

type Folder = {
  name: string;
  folders: Array<Folder>;
  files: Array<File>;
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
        files: [],
      },
    ],
    files: [{ name: 'index.html', includeFile: 'index.html' }],
  },
};
