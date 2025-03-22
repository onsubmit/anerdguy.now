import { ChosenColors } from './components/color-dialog';
import { FontName } from './fonts';
import { ThemeName } from './themes';

type CacheVersion = 1;
const currentVersion: CacheVersion = 1 as const;
type CurrentVersion = typeof currentVersion;

type File = {
  isOpen: boolean;
  contentsOnDisk: string;
};

type Cache = {
  1: Partial<{
    selectedTheme: ThemeName | 'Custom';
    theme: ChosenColors;
    font: FontName;
    files: Record<string, File>;
  }>;
};

const LOCAL_STORAGE_KEY = 'cache';

export const getCachedItem = <K extends keyof Cache[CurrentVersion]>(
  item: K,
): Cache[CurrentVersion][K] => {
  const cache = getCache();
  return cache[currentVersion][item];
};

export const setCachedItem = <K extends keyof Cache[CurrentVersion]>(
  item: K,
  value: Cache[CurrentVersion][K],
): void => {
  const cache = getCache();
  cache[currentVersion][item] = value;
  writeCache(cache);
};

export const setTheme = (theme: ChosenColors): void => {
  setCachedItem('theme', theme);
};

export const writeFileToDisk = (filename: string, contents: string): void => {
  const cache = getCache();
  let { files } = cache[currentVersion];
  if (!files) {
    files = {};
  }

  cache[currentVersion].files = files;

  if (!files[filename]) {
    files[filename] = {
      isOpen: true,
      contentsOnDisk: contents,
    };
  } else {
    files[filename].contentsOnDisk = contents;
  }

  writeCache(cache);
};

export const markCachedFile = <K extends keyof File>(
  filename: string,
  key: K,
  value: File[K],
): void => {
  const cache = getCache();
  const file = cache[currentVersion].files?.[filename];
  if (file) {
    file[key] = value;
    writeCache(cache);
  }
};

export const doesFileExistOnDisk = (filename: string): boolean => {
  const cache = getCache();
  return cache[currentVersion].files?.[filename]?.contentsOnDisk !== undefined;
};

const getCache = (): Cache => {
  const cacheStr = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!cacheStr) {
    return { [currentVersion]: {} };
  }

  try {
    // TODO: Use Zod to validate schema
    return (JSON.parse(cacheStr) ?? {}) as Cache;
  } catch {
    return { [currentVersion]: {} };
  }
};

export const writeCache = (cache: Cache): void => {
  try {
    const cacheStr = JSON.stringify(cache);
    localStorage.setItem(LOCAL_STORAGE_KEY, cacheStr);
  } catch (e) {
    console.error(e);
  }
};

export const getOpenCachedFiles = (): Array<string> => {
  const cachedFiles = getCachedItem('files');
  const openCachedFiles = cachedFiles
    ? Object.keys(cachedFiles).filter((f) => cachedFiles[f].isOpen)
    : [];
  return openCachedFiles;
};
