import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { OpportunityReport } from '../shared/report-schema';
import { parseReport } from '../shared/report-schema';
import type { RepositoryCandidate } from './candidates';
import type { RepositorySignalAnalysis } from './repository-signals';
import type { StarDelta } from './star-snapshots';

export type BuildReportInput = {
  date: string;
  generatedAt: string;
  candidates: RepositoryCandidate[];
  deltas: StarDelta[];
  analyses: Map<string, RepositorySignalAnalysis>;
};

export const buildReport = (input: BuildReportInput): OpportunityReport => {
  const deltaByName = new Map(input.deltas.map((delta) => [delta.fullName, delta]));

  const items = input.candidates
    .map((candidate, index) => {
      const analysis = input.analyses.get(candidate.fullName);
      const delta = deltaByName.get(candidate.fullName);

      if (!analysis || !delta) {
        return null;
      }

      return {
        rank: index + 1,
        repository: {
          owner: candidate.owner,
          name: candidate.name,
          url: candidate.url,
          primaryLanguage: candidate.language
        },
        popularity: {
          starsTotal: candidate.starsTotal,
          starsAdded24h: delta.starsAdded24h,
          lastUpdatedAt: candidate.pushedAt
        },
        health: analysis.health,
        opportunity: analysis.opportunity,
        risk: analysis.risk,
        recommendation: analysis.recommendation
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((left, right) => right.popularity.starsAdded24h - left.popularity.starsAdded24h)
    .slice(0, 10)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  return parseReport({
    date: input.date,
    generatedAt: input.generatedAt,
    summary: {
      candidateCount: items.length,
      actionableCount: items.filter((item) => item.recommendation === '值得继续').length
    },
    items
  });
};

export const writeReportFiles = async (root: string, report: OpportunityReport): Promise<void> => {
  await mkdir(root, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;

  await Promise.all([
    writeFile(join(root, `${report.date}.json`), json, 'utf8'),
    writeFile(join(root, 'latest.json'), json, 'utf8')
  ]);
};
