function importRawFiles(): Record<string, () => Promise<string>> {
  const modules = import.meta.glob<string>('/src/inc/**/*.html', {
    query: '?raw',
    import: 'default',
  });
  return modules;
}

export const rawFiles = importRawFiles();
