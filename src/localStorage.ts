import { z } from 'zod';

import { knownColors } from './colors';
import { ChosenColors } from './components/color-dialog';
import { fontNames, fontSizes } from './fonts';
import { knownThemeableItems, themeNames } from './themes';

type CacheVersion = 1;
const currentVersion: CacheVersion = 1 as const;
type CurrentVersion = typeof currentVersion;

const MINUTES_TO_LIVE = 60;

const fileSchema = z.object({
  isOpen: z.boolean(),
  contentsOnDisk: z.string(),
  diskContentsExpirationDate: z.coerce.date().optional(),
});

const cacheSchema = z.object({
  1: z
    .object({
      selectedTheme: z.enum([...themeNames, 'Custom']),
      theme: z.partialRecord(
        z.enum(knownThemeableItems),
        z
          .object({
            foreground: z.enum(knownColors),
            background: z.enum(knownColors),
          })
          .partial(),
      ),
      font: z.enum(fontNames),
      fontSize: z.enum(fontSizes),
      files: z.record(z.string(), fileSchema),
    })
    .partial(),
});

type File = z.infer<typeof fileSchema>;
type Cache = z.infer<typeof cacheSchema>;

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
      diskContentsExpirationDate: getDiskContentsExpirationDate(),
    };
  } else {
    files[filename].contentsOnDisk = contents;
  }

  writeCache(cache);
};

export const updateExpiredFileContentCache = (filename: string): void => {
  const cache = getCache();
  const files = cache[currentVersion].files;

  if (files?.[filename] === undefined) {
    return;
  }

  let write = false;
  if (!files[filename].diskContentsExpirationDate) {
    files[filename].diskContentsExpirationDate = getDiskContentsExpirationDate();
    write = true;
  }

  if (new Date(Date.now()) > files[filename].diskContentsExpirationDate) {
    delete files[filename];
    write = true;
  }

  if (write) {
    writeCache(cache);
  }
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
    const cacheResult = cacheSchema.safeParse(JSON.parse(cacheStr));
    return cacheResult.success ? cacheResult.data : { [currentVersion]: {} };
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

const getDiskContentsExpirationDate = (): Date => {
  return new Date(Date.now() + MINUTES_TO_LIVE * 60 * 1000);
};
