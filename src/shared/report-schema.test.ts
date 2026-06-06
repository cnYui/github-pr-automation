import { describe, expect, it } from 'vitest';
import { parseReport } from './report-schema';

const validReport = {
  date: '2026-06-05',
  generatedAt: '2026-06-05T21:12:34+09:00',
  summary: {
    candidateCount: 10,
    actionableCount: 1
  },
  items: [
    {
      rank: 1,
      repository: {
        owner: 'openai',
        name: 'example',
        url: 'https://github.com/openai/example',
        primaryLanguage: 'TypeScript'
      },
      popularity: {
        starsTotal: 12000,
        starsAdded24h: 430,
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
        summary: '核心解析器缺少边界输入测试',
        evidence: ['tests/parser 目录存在', '近期 issue 提到边界输入异常']
      },
      risk: {
        level: '低',
        reason: '改动集中在测试文件，已有测试框架可验证'
      },
      recommendation: '值得继续'
    }
  ]
};

describe('parseReport', () => {
  it('接受符合报告页面需要的日报 JSON', () => {
    const report = parseReport(validReport);

    expect(report.summary.actionableCount).toBe(1);
    expect(report.items[0]?.recommendation).toBe('值得继续');
  });

  it('拒绝会诱导提交动作的建议值', () => {
    expect(() =>
      parseReport({
        ...validReport,
        items: [{ ...validReport.items[0], recommendation: '自动提交 PR' }]
      })
    ).toThrow();
  });

  it('接受 GitHub Trending 中任意非空主语言', () => {
    const report = parseReport({
      ...validReport,
      items: [
        {
          ...validReport.items[0],
          repository: {
            ...validReport.items[0].repository,
            primaryLanguage: 'Rust'
          }
        }
      ]
    });

    expect(report.items[0]?.repository.primaryLanguage).toBe('Rust');
  });
});
