function importRawFiles(): Record<string, () => Promise<string>> {
  const modules = import.meta.glob('/src/inc/**/*.html', { as: 'raw' });
  return modules;
}

export const rawFiles = importRawFiles();
