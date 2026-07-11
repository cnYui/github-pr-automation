import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { resolveGitHubToken } from '../shared/github-auth';
import { createGitHubClient } from './github-client';
import { runScan } from './scan-runner';
import type { StarSnapshotItem } from './star-snapshots';

const today = new Date();
const date = today.toISOString().slice(0, 10);
const token = await resolveGitHubToken();

const readPreviousSnapshot = async (): Promise<StarSnapshotItem[]> => {
  const path = resolve('data/snapshots/latest.json');

  try {
    return JSON.parse(await readFile(path, 'utf8')) as StarSnapshotItem[];
  } catch {
    return [];
  }
};

await runScan({
  date,
  generatedAt: today.toISOString(),
  reportDir: resolve('public/reports'),
  snapshotDir: resolve('data/snapshots'),
  previousSnapshot: await readPreviousSnapshot(),
  client: createGitHubClient(token)
});
