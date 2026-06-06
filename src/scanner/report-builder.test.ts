import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildReport, writeReportFiles } from './report-builder';

describe('buildReport', () => {
  it('生成按新增 Star 排序的页面报告', () => {
    const report = buildReport({
      date: '2026-06-05',
      generatedAt: '2026-06-05T21:12:34+09:00',
      candidates: [
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
      deltas: [{ fullName: 'a/fast', starsTotal: 1000, starsAdded24h: 90, isColdStart: false }],
      analyses: new Map([
        [
          'a/fast',
          {
            health: {
              license: 'MIT',
              hasCi: true,
              hasTests: true,
              hasContributing: true,
              issueActivity: 'active'
            },
            opportunity: {
              category: '测试补充',
              summary: '补充解析器边界测试',
              evidence: ['tests/parser.test.ts']
            },
            risk: {
              level: '低',
              reason: '改动集中在测试'
            },
            recommendation: '值得继续'
          }
        ]
      ])
    });

    expect(report.summary).toEqual({ candidateCount: 1, actionableCount: 1 });
    expect(report.items[0]?.popularity.starsAdded24h).toBe(90);
  });
});

describe('writeReportFiles', () => {
  it('同时写入日期报告和 latest.json', async () => {
    const root = await mkdtemp(join(tmpdir(), 'github-pr-report-'));
    const report = buildReport({
      date: '2026-06-05',
      generatedAt: '2026-06-05T21:12:34+09:00',
      candidates: [],
      deltas: [],
      analyses: new Map()
    });

    await writeReportFiles(root, report);

    const latest = JSON.parse(await readFile(join(root, 'latest.json'), 'utf8'));
    const dated = JSON.parse(await readFile(join(root, '2026-06-05.json'), 'utf8'));

    expect(latest.date).toBe('2026-06-05');
    expect(dated.date).toBe('2026-06-05');
  });
});
