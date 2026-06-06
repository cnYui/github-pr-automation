import type { OpportunityCategory, Recommendation, RiskLevel } from '../shared/report-schema';

export type RepositorySignalsInput = {
  license: string | null;
  files: string[];
  issueTitles: string[];
  openPullRequestTitles: string[];
};

export type RepositorySignalAnalysis = {
  health: {
    license: string;
    hasCi: boolean;
    hasTests: boolean;
    hasContributing: boolean;
    issueActivity: 'active' | 'quiet' | 'unknown';
  };
  opportunity: {
    category: OpportunityCategory;
    summary: string;
    evidence: string[];
  };
  risk: {
    level: RiskLevel;
    reason: string;
  };
  recommendation: Recommendation;
};

const includesAny = (values: string[], patterns: RegExp[]): boolean => {
  return values.some((value) => patterns.some((pattern) => pattern.test(value)));
};

const hasDuplicatePullRequest = (issueTitles: string[], pullRequestTitles: string[]): boolean => {
  const pullRequestTokenSets = pullRequestTitles.map((title) => new Set(title.toLowerCase().split(/\W+/).filter(Boolean)));

  return issueTitles.some((issueTitle) => {
    const issueTokens = issueTitle.toLowerCase().split(/\W+/).filter((token) => token.length > 2);

    return pullRequestTokenSets.some((pullRequestTokens) => {
      const overlap = issueTokens.filter((token) => pullRequestTokens.has(token));

      return overlap.length >= 2;
    });
  });
};

export const analyzeRepositorySignals = (input: RepositorySignalsInput): RepositorySignalAnalysis => {
  const hasCi = includesAny(input.files, [/^\.github\/workflows\//, /^\.circleci\//]);
  const hasTests = includesAny(input.files, [/test/i, /spec/i]);
  const hasContributing = includesAny(input.files, [/^CONTRIBUTING\.md$/i, /^\.github\/ISSUE_TEMPLATE\//i]);
  const issueActivity: 'active' | 'quiet' = input.issueTitles.length > 0 ? 'active' : 'quiet';
  const duplicate = hasDuplicatePullRequest(input.issueTitles, input.openPullRequestTitles);
  const health = {
    license: input.license ?? '未发现',
    hasCi,
    hasTests,
    hasContributing,
    issueActivity
  };

  if (duplicate) {
    return {
      health,
      opportunity: {
        category: '文档缺口',
        summary: '已有相近 PR，继续推进会打扰维护者',
        evidence: input.openPullRequestTitles.slice(0, 2)
      },
      risk: {
        level: '高',
        reason: '已有相近打开中的 PR'
      },
      recommendation: '跳过'
    };
  }

  const category: OpportunityCategory = hasTests ? '测试补充' : hasContributing ? '文档缺口' : '示例补全';
  const riskLevel: RiskLevel = input.license && hasTests && hasCi ? '低' : '中';

  return {
    health,
    opportunity: {
      category,
      summary: category === '测试补充' ? '已有测试框架，可补充 issue 暴露的边界场景' : '可从贡献规范和 README 缺口切入',
      evidence: [
        ...input.files.filter((file) => /test|spec|CONTRIBUTING|README|workflow/i.test(file)).slice(0, 3),
        ...input.issueTitles.slice(0, 2)
      ]
    },
    risk: {
      level: riskLevel,
      reason: riskLevel === '低' ? '改动可集中在测试或文档，且存在 CI 验证' : '缺少完整贡献或验证信号'
    },
    recommendation: riskLevel === '低' ? '值得继续' : '谨慎'
  };
};
