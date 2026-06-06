import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { runScan } from './scan-runner';

describe('runScan', () => {
  it('用注入的 GitHub client 生成 latest 报告并写回 Star 快照，不访问真实网络', async () => {
    const root = await mkdtemp(join(tmpdir(), 'github-pr-scan-'));
    const reportDir = join(root, 'reports');
    const snapshotDir = join(root, 'snapshots');

    await runScan({
      date: '2026-06-05',
      generatedAt: '2026-06-05T21:12:34+09:00',
      reportDir,
      snapshotDir,
      previousSnapshot: [{ fullName: 'a/fast', starsTotal: 900 }],
      client: {
        searchRepositories: async () => [
          {
            fullName: 'a/fast',
            owner: 'a',
            name: 'fast',
            url: 'https://github.com/a/fast',
            language: 'TypeScript',
            archived: false,
            starsTotal: 1000,
            pushedAt: '2026-06-05T08:00:00Z'
          }
        ],
        getRepositorySignals: async () => ({
          license: 'MIT',
          files: ['README.md', 'CONTRIBUTING.md', '.github/workflows/ci.yml', 'tests/parser.test.ts'],
          issueTitles: ['Parser fails on empty nested input'],
          openPullRequestTitles: []
        })
      }
    });

    const latest = JSON.parse(await readFile(join(reportDir, 'latest.json'), 'utf8'));
    const snapshot = JSON.parse(await readFile(join(snapshotDir, 'latest.json'), 'utf8'));

    expect(latest.summary.actionableCount).toBe(1);
    expect(latest.items[0].repository.owner).toBe('a');
    expect(snapshot).toEqual([{ fullName: 'a/fast', starsTotal: 1000 }]);
  });
});
