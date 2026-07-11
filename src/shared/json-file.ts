import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export const readJsonFile = async <T>(path: string): Promise<T> => {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch (primaryError) {
    try {
      return JSON.parse(await readFile(`${path}.backup`, 'utf8')) as T;
    } catch {
      throw primaryError;
    }
  }
};

export const writeJsonFileAtomic = async (path: string, value: unknown): Promise<void> => {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${process.pid}.${randomUUID()}.tmp`;
  const backupPath = `${path}.backup`;
  const json = `${JSON.stringify(value, null, 2)}\n`;

  await writeFile(temporaryPath, json, 'utf8');

  try {
    await rename(temporaryPath, path);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;

    if (code !== 'EEXIST' && code !== 'EPERM') {
      throw error;
    }

    await rm(backupPath, { force: true });
    let hasBackup = false;

    try {
      await rename(path, backupPath);
      hasBackup = true;
    } catch (backupError) {
      if ((backupError as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw backupError;
      }
    }

    try {
      await rename(temporaryPath, path);
      await rm(backupPath, { force: true });
    } catch (replacementError) {
      if (hasBackup) {
        await rm(path, { force: true });
        await rename(backupPath, path);
      }

      throw replacementError;
    }
  } finally {
    await rm(temporaryPath, { force: true });
  }
};
