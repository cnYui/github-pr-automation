import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { selectCandidateRepositories, type SupportedLanguage } from './candidates';
import type { GitHubClient } from './github-client';
import { analyzeRepositorySignals } from './repository-signals';
import { buildReport, writeReportFiles } from './report-builder';
import { calculateStarDeltas, type StarSnapshotItem } from './star-snapshots';

export type RunScanInput = {
  date: string;
  generatedAt: string;
  reportDir: string;
  snapshotDir: string;
  previousSnapshot: StarSnapshotItem[];
  client: GitHubClient;
  languages?: SupportedLanguage[];
  limit?: number;
};

const writeSnapshotFiles = async (
  snapshotDir: string,
  date: string,
  snapshot: StarSnapshotItem[]
): Promise<void> => {
  await mkdir(snapshotDir, { recursive: true });
  const json = `${JSON.stringify(snapshot, null, 2)}\n`;

  await Promise.all([
    writeFile(join(snapshotDir, `${date}.json`), json, 'utf8'),
    writeFile(join(snapshotDir, 'latest.json'), json, 'utf8')
  ]);
};

export const runScan = async (input: RunScanInput): Promise<void> => {
  const languages = input.languages ?? [];
  const rawCandidates = await input.client.searchRepositories(languages, input.limit ?? 30);
  const candidates = selectCandidateRepositories(rawCandidates, languages).slice(0, 10);
  const currentSnapshot = candidates.map((candidate) => ({
    fullName: candidate.fullName,
    starsTotal: candidate.starsTotal
  }));
  const deltas = calculateStarDeltas(currentSnapshot, input.previousSnapshot);
  const analyses = new Map();

  for (const candidate of candidates) {
    const signals = await input.client.getRepositorySignals(candidate);
    analyses.set(candidate.fullName, analyzeRepositorySignals(signals));
  }

  const report = buildReport({
    date: input.date,
    generatedAt: input.generatedAt,
    candidates,
    deltas,
    analyses
  });

  await Promise.all([
    writeReportFiles(input.reportDir, report),
    writeSnapshotFiles(input.snapshotDir, input.date, currentSnapshot)
  ]);
};
