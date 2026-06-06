// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import type { OpportunityReport } from '../shared/report-schema';
import { renderReport } from './report-view';

const report: OpportunityReport = {
  date: '2026-06-05',
  generatedAt: '2026-06-05T21:12:34+09:00',
  summary: { candidateCount: 1, actionableCount: 1 },
  items: [
    {
      rank: 1,
      repository: {
        owner: 'a',
        name: 'fast',
        url: 'https://github.com/a/fast',
        primaryLanguage: 'TypeScript'
      },
      popularity: {
        starsTotal: 1000,
        starsAdded24h: 90,
        lastUpdatedAt: '2026-06-05T08:00:00Z'
      },
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
        evidence: ['tests/parser.test.ts', '<img src=x onerror=alert(1)>']
      },
      risk: {
        level: '低',
        reason: '改动集中在测试'
      },
      recommendation: '值得继续'
    }
  ]
};

describe('renderReport', () => {
  it('渲染只读日报表格且不包含按钮', () => {
    const root = document.createElement('main');

    renderReport(root, report);

    expect(root.textContent).toContain('a/fast');
    expect(root.textContent).toContain('补充解析器边界测试');
    expect(root.querySelectorAll('button')).toHaveLength(0);
  });

  it('把外部证据文本作为纯文本展示', () => {
    const root = document.createElement('main');

    renderReport(root, report);

    expect(root.textContent).toContain('<img src=x onerror=alert(1)>');
    expect(root.querySelectorAll('img')).toHaveLength(0);
  });
});
