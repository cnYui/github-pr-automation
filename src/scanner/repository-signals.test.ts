import { describe, expect, it } from 'vitest';
import { analyzeRepositorySignals } from './repository-signals';

describe('analyzeRepositorySignals', () => {
  it('把有测试框架和边界问题证据的仓库标为低风险测试补充', () => {
    const result = analyzeRepositorySignals({
      license: 'MIT',
      files: ['README.md', 'CONTRIBUTING.md', '.github/workflows/ci.yml', 'tests/parser.test.ts'],
      issueTitles: ['Parser fails on empty nested input'],
      openPullRequestTitles: []
    });

    expect(result.health).toEqual({
      license: 'MIT',
      hasCi: true,
      hasTests: true,
      hasContributing: true,
      issueActivity: 'active'
    });
    expect(result.opportunity.category).toBe('测试补充');
    expect(result.risk.level).toBe('低');
    expect(result.recommendation).toBe('值得继续');
  });

  it('发现重复 PR 时标记高风险并跳过', () => {
    const result = analyzeRepositorySignals({
      license: 'MIT',
      files: ['README.md', 'tests/example.test.py'],
      issueTitles: ['Need docs for install'],
      openPullRequestTitles: ['Add docs for install']
    });

    expect(result.risk.level).toBe('高');
    expect(result.recommendation).toBe('跳过');
  });
});
