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

  it('重型基础设施仓库没有低风险文档切口时直接跳过', () => {
    const result = analyzeRepositorySignals({
      license: 'Apache-2.0',
      files: ['README.md', 'terraform/main.tf', 'helm/chart/Chart.yaml', '.github/workflows/deploy.yml'],
      issueTitles: ['Provisioning cluster fails on AWS'],
      openPullRequestTitles: []
    });

    expect(result.risk.level).toBe('高');
    expect(result.recommendation).toBe('跳过');
  });

  it('重型基础设施仓库存在文档坏链类切口时只标为谨慎', () => {
    const result = analyzeRepositorySignals({
      license: 'Apache-2.0',
      files: ['README.md', 'docs/install.md', 'terraform/main.tf', 'helm/chart/Chart.yaml'],
      issueTitles: ['README install link is broken'],
      openPullRequestTitles: []
    });

    expect(result.opportunity.category).toBe('文档缺口');
    expect(result.risk.level).toBe('中');
    expect(result.recommendation).toBe('谨慎');
  });
});
