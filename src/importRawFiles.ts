function importRawFiles(): Record<string, () => Promise<string>> {
  const modules = import.meta.glob<string>('/src/inc/**/*.html', {
    query: '?raw',
    import: 'default',
  });
  return modules;
}

const rawFiles = importRawFiles();
export const rawFileExists = (filename: string): boolean => !!rawFiles[`/src/inc/${filename}`];

export const getRawFileContents = async (filename: string): Promise<string> => {
  if (!rawFileExists(filename)) {
    throw new Error(`${filename} does not exist.`);
  }

  return await rawFiles[`/src/inc/${filename}`]();
};
