import { ChosenColors } from './components/color-dialog';

type CacheVersion = 1;
const currentVersion: CacheVersion = 1 as const;
type CurrentVersion = typeof currentVersion;

type Cache = {
  1: Partial<{
    theme: ChosenColors;
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

  try {
    const cacheStr = JSON.stringify(cache);
    localStorage.setItem(LOCAL_STORAGE_KEY, cacheStr);
  } catch (e) {
    console.error(e);
  }
};

export const setTheme = (theme: ChosenColors): void => {
  const cache = getCache();
  cache[currentVersion].theme = theme;

  try {
    const cacheStr = JSON.stringify(cache);
    localStorage.setItem(LOCAL_STORAGE_KEY, cacheStr);
  } catch (e) {
    console.error(e);
  }
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
