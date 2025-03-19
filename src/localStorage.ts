import { ChosenColors } from './components/color-dialog';

type CacheVersion = 1;
const currentVersion: CacheVersion = 1 as const;
type CurrentVersion = typeof currentVersion;

type Cache = {
  1: Partial<{
    theme: ChosenColors;
    files: Record<
      string,
      {
        isOpen: boolean;
        contentsOnDisk: string;
      }
    >;
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

export const openCachedFile = (filename: string): void => {
  const cache = getCache();
  const file = cache[currentVersion].files?.[filename];
  if (file) {
    file.isOpen = true;
    writeCache(cache);
  }
};

export const closeCachedFile = (filename: string): void => {
  const cache = getCache();
  const file = cache[currentVersion].files?.[filename];
  if (file) {
    file.isOpen = false;
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
