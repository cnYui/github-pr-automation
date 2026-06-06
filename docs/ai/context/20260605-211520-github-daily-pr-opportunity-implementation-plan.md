# GitHub 每日 PR 机会展示页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个本地每日 GitHub 热门项目扫描器、只读报告页面，以及 `github-daily-pr-opportunity-scan` Skill，用表格展示项目热度、PR 切入口和风险。

**Architecture:** 扫描脚本负责 GitHub API、Star 快照、仓库信号分析和报告 JSON；Web 页面只读取 `public/reports/latest.json` 并渲染表格；Skill 只沉淀扫描流程与质量门槛，不执行提交动作。

**Tech Stack:** TypeScript、Node.js fetch、Zod、Vite、Vitest、jsdom、Codex Skill。

---

## 执行前约束

- 当前目录不是 git 仓库。执行阶段不要擅自初始化 git；若用户要求提交，再先询问是否初始化仓库。
- 需要 GitHub API 时读取环境变量 `GITHUB_TOKEN`。测试必须使用 fixture 和 fake client，不依赖真实网络。
- 页面不放按钮，不接触 GitHub Token，不触发 fork、commit 或 PR 创建。
- 扫描结果写入 `public/reports/latest.json`，Star 快照写入 `data/snapshots/<date>.json`。

## 文件结构

| 路径 | 职责 |
| --- | --- |
| `package.json` | npm 脚本与依赖声明 |
| `tsconfig.json` | TypeScript 配置 |
| `vitest.config.ts` | Vitest 配置 |
| `index.html` | Vite 单页入口 |
| `src/shared/report-schema.ts` | 报告 JSON 的 Zod schema 与类型 |
| `src/scanner/star-snapshots.ts` | Star 快照差分与冷启动标记 |
| `src/scanner/candidates.ts` | GitHub 搜索结果过滤与候选排序 |
| `src/scanner/repository-signals.ts` | 仓库健康度、切入口与风险分析 |
| `src/scanner/report-builder.ts` | 聚合候选、分析结果并输出报告 JSON |
| `src/scanner/github-client.ts` | GitHub API fetch 封装 |
| `src/scanner/scan-runner.ts` | 注入 client/storage 的扫描编排逻辑 |
| `src/scanner/cli.ts` | 命令行入口 |
| `src/web/report-view.ts` | 只读表格 DOM 渲染 |
| `src/web/main.ts` | 加载 `latest.json` 并挂载页面 |
| `src/web/styles.css` | 单页表格样式 |
| `public/reports/latest.json` | 页面开发用样例报告 |
| `tests/skill/github-daily-pr-opportunity-scan.md` | Skill 压力场景 |
| `/Users/wujianxiang/.codex/skills/github-daily-pr-opportunity-scan/SKILL.md` | 可被 Codex 发现的个人 Skill |

## Task 1: 项目脚手架

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `index.html`
- Create: `src/web/styles.css`

- [ ] **Step 1: 创建 npm 配置**

`package.json`：

```json
{
  "name": "github-daily-pr-opportunity-dashboard",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "scan": "tsx src/scanner/cli.ts",
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "zod": "^3.25.0"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "jsdom": "^24.1.0",
    "tsx": "^4.16.0",
    "typescript": "^5.5.0",
    "vite": "^5.3.0",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: 创建 TypeScript 与测试配置**

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "types": ["node", "vitest/globals"]
  },
  "include": ["src", "tests", "vitest.config.ts"]
}
```

`vitest.config.ts`：

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node'
  }
});
```

- [ ] **Step 3: 创建页面入口**

`index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GitHub PR 机会日报</title>
  </head>
  <body>
    <main id="app"></main>
    <script type="module" src="/src/web/main.ts"></script>
  </body>
</html>
```

`src/web/styles.css`：

```css
:root {
  color: #1f2937;
  background: #f6f7f9;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  margin: 0;
}
```

- [ ] **Step 4: 安装依赖并确认工具链可用**

Run: `npm install`

Expected: 生成 `package-lock.json`，安装成功。

Run: `npx tsc --noEmit`

Expected: PASS，无 TypeScript 错误。

## Task 2: 报告 JSON Schema

**Files:**
- Create: `src/shared/report-schema.test.ts`
- Create: `src/shared/report-schema.ts`

- [ ] **Step 1: 写失败测试**

`src/shared/report-schema.test.ts`：

```ts
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
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- src/shared/report-schema.test.ts`

Expected: FAIL，错误包含 `Cannot find module './report-schema'`。

- [ ] **Step 3: 写最小实现**

`src/shared/report-schema.ts`：

```ts
import { z } from 'zod';

export const recommendationSchema = z.enum(['值得继续', '谨慎', '跳过']);
export const riskLevelSchema = z.enum(['低', '中', '高']);
export const opportunityCategorySchema = z.enum([
  '文档缺口',
  '示例补全',
  '测试补充',
  '小 bug',
  'CI/类型错误'
]);

export const reportItemSchema = z.object({
  rank: z.number().int().positive(),
  repository: z.object({
    owner: z.string().min(1),
    name: z.string().min(1),
    url: z.string().url(),
    primaryLanguage: z.enum(['TypeScript', 'JavaScript', 'Python'])
  }),
  popularity: z.object({
    starsTotal: z.number().int().nonnegative(),
    starsAdded24h: z.number().int().nonnegative(),
    lastUpdatedAt: z.string().min(1)
  }),
  health: z.object({
    license: z.string().min(1),
    hasCi: z.boolean(),
    hasTests: z.boolean(),
    hasContributing: z.boolean(),
    issueActivity: z.enum(['active', 'quiet', 'unknown'])
  }),
  opportunity: z.object({
    category: opportunityCategorySchema,
    summary: z.string().min(1),
    evidence: z.array(z.string().min(1)).min(1)
  }),
  risk: z.object({
    level: riskLevelSchema,
    reason: z.string().min(1)
  }),
  recommendation: recommendationSchema
});

export const opportunityReportSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  generatedAt: z.string().min(1),
  summary: z.object({
    candidateCount: z.number().int().nonnegative(),
    actionableCount: z.number().int().nonnegative()
  }),
  items: z.array(reportItemSchema)
});

export type OpportunityReport = z.infer<typeof opportunityReportSchema>;
export type ReportItem = z.infer<typeof reportItemSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
export type RiskLevel = z.infer<typeof riskLevelSchema>;
export type OpportunityCategory = z.infer<typeof opportunityCategorySchema>;

export const parseReport = (input: unknown): OpportunityReport => {
  return opportunityReportSchema.parse(input);
};
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm test -- src/shared/report-schema.test.ts`

Expected: PASS，2 个测试通过。

## Task 3: Star 快照差分

**Files:**
- Create: `src/scanner/star-snapshots.test.ts`
- Create: `src/scanner/star-snapshots.ts`

- [ ] **Step 1: 写失败测试**

`src/scanner/star-snapshots.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { calculateStarDeltas } from './star-snapshots';

describe('calculateStarDeltas', () => {
  it('用两天快照计算 24 小时新增 Star 并降序排序', () => {
    const result = calculateStarDeltas(
      [
        { fullName: 'a/fast', starsTotal: 150 },
        { fullName: 'b/slow', starsTotal: 90 }
      ],
      [
        { fullName: 'a/fast', starsTotal: 100 },
        { fullName: 'b/slow', starsTotal: 80 }
      ]
    );

    expect(result).toEqual([
      { fullName: 'a/fast', starsTotal: 150, starsAdded24h: 50, isColdStart: false },
      { fullName: 'b/slow', starsTotal: 90, starsAdded24h: 10, isColdStart: false }
    ]);
  });

  it('首次运行缺少历史快照时标记冷启动', () => {
    const result = calculateStarDeltas([{ fullName: 'a/new', starsTotal: 120 }], []);

    expect(result).toEqual([
      { fullName: 'a/new', starsTotal: 120, starsAdded24h: 120, isColdStart: true }
    ]);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- src/scanner/star-snapshots.test.ts`

Expected: FAIL，错误包含 `Cannot find module './star-snapshots'`。

- [ ] **Step 3: 写最小实现**

`src/scanner/star-snapshots.ts`：

```ts
export type StarSnapshotItem = {
  fullName: string;
  starsTotal: number;
};

export type StarDelta = StarSnapshotItem & {
  starsAdded24h: number;
  isColdStart: boolean;
};

export const calculateStarDeltas = (
  current: StarSnapshotItem[],
  previous: StarSnapshotItem[]
): StarDelta[] => {
  const previousByName = new Map(previous.map((item) => [item.fullName, item.starsTotal]));

  return current
    .map((item) => {
      const previousStars = previousByName.get(item.fullName);
      const isColdStart = previousStars === undefined;

      return {
        ...item,
        starsAdded24h: isColdStart ? item.starsTotal : Math.max(0, item.starsTotal - previousStars),
        isColdStart
      };
    })
    .sort((left, right) => right.starsAdded24h - left.starsAdded24h);
};
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm test -- src/scanner/star-snapshots.test.ts`

Expected: PASS，2 个测试通过。

## Task 4: 候选仓库过滤

**Files:**
- Create: `src/scanner/candidates.test.ts`
- Create: `src/scanner/candidates.ts`

- [ ] **Step 1: 写失败测试**

`src/scanner/candidates.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { selectCandidateRepositories } from './candidates';

describe('selectCandidateRepositories', () => {
  it('只保留活跃且语言匹配的非 archived 仓库', () => {
    const result = selectCandidateRepositories(
      [
        {
          fullName: 'a/ts',
          owner: 'a',
          name: 'ts',
          url: 'https://github.com/a/ts',
          language: 'TypeScript',
          archived: false,
          starsTotal: 5000,
          pushedAt: '2026-06-04T10:00:00Z'
        },
        {
          fullName: 'b/rust',
          owner: 'b',
          name: 'rust',
          url: 'https://github.com/b/rust',
          language: 'Rust',
          archived: false,
          starsTotal: 9000,
          pushedAt: '2026-06-04T10:00:00Z'
        },
        {
          fullName: 'c/old',
          owner: 'c',
          name: 'old',
          url: 'https://github.com/c/old',
          language: 'Python',
          archived: true,
          starsTotal: 7000,
          pushedAt: '2026-06-04T10:00:00Z'
        }
      ],
      ['TypeScript', 'JavaScript', 'Python']
    );

    expect(result.map((item) => item.fullName)).toEqual(['a/ts']);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- src/scanner/candidates.test.ts`

Expected: FAIL，错误包含 `Cannot find module './candidates'`。

- [ ] **Step 3: 写最小实现**

`src/scanner/candidates.ts`：

```ts
export type SupportedLanguage = 'TypeScript' | 'JavaScript' | 'Python';

export type RepositoryCandidate = {
  fullName: string;
  owner: string;
  name: string;
  url: string;
  language: string | null;
  archived: boolean;
  starsTotal: number;
  pushedAt: string;
};

export const selectCandidateRepositories = (
  repositories: RepositoryCandidate[],
  languages: SupportedLanguage[]
): RepositoryCandidate[] => {
  const allowed = new Set<string>(languages);

  return repositories
    .filter((repository) => !repository.archived)
    .filter((repository) => repository.language !== null && allowed.has(repository.language))
    .sort((left, right) => right.starsTotal - left.starsTotal);
};
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm test -- src/scanner/candidates.test.ts`

Expected: PASS，1 个测试通过。

## Task 5: 仓库健康度、切入口与风险分析

**Files:**
- Create: `src/scanner/repository-signals.test.ts`
- Create: `src/scanner/repository-signals.ts`

- [ ] **Step 1: 写失败测试**

`src/scanner/repository-signals.test.ts`：

```ts
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
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- src/scanner/repository-signals.test.ts`

Expected: FAIL，错误包含 `Cannot find module './repository-signals'`。

- [ ] **Step 3: 写最小实现**

`src/scanner/repository-signals.ts`：

```ts
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
  const normalizedPullRequests = pullRequestTitles.map((title) => title.toLowerCase());

  return issueTitles.some((issueTitle) =>
    normalizedPullRequests.some((pullRequestTitle) =>
      pullRequestTitle.includes(issueTitle.toLowerCase().slice(0, 16))
    )
  );
};

export const analyzeRepositorySignals = (input: RepositorySignalsInput): RepositorySignalAnalysis => {
  const hasCi = includesAny(input.files, [/^\.github\/workflows\//, /^\.circleci\//]);
  const hasTests = includesAny(input.files, [/test/i, /spec/i]);
  const hasContributing = includesAny(input.files, [/^CONTRIBUTING\.md$/i, /^\.github\/ISSUE_TEMPLATE\//i]);
  const issueActivity = input.issueTitles.length > 0 ? 'active' : 'quiet';
  const duplicate = hasDuplicatePullRequest(input.issueTitles, input.openPullRequestTitles);

  if (duplicate) {
    return {
      health: {
        license: input.license ?? '未发现',
        hasCi,
        hasTests,
        hasContributing,
        issueActivity
      },
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
    health: {
      license: input.license ?? '未发现',
      hasCi,
      hasTests,
      hasContributing,
      issueActivity
    },
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
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm test -- src/scanner/repository-signals.test.ts`

Expected: PASS，2 个测试通过。

## Task 6: 报告构建与文件输出

**Files:**
- Create: `src/scanner/report-builder.test.ts`
- Create: `src/scanner/report-builder.ts`

- [ ] **Step 1: 写失败测试**

`src/scanner/report-builder.test.ts`：

```ts
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
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- src/scanner/report-builder.test.ts`

Expected: FAIL，错误包含 `Cannot find module './report-builder'`。

- [ ] **Step 3: 写最小实现**

`src/scanner/report-builder.ts`：

```ts
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
          primaryLanguage: candidate.language as 'TypeScript' | 'JavaScript' | 'Python'
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
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm test -- src/scanner/report-builder.test.ts`

Expected: PASS，2 个测试通过。

## Task 7: GitHub Client 与扫描编排

**Files:**
- Create: `src/scanner/scan-runner.test.ts`
- Create: `src/scanner/github-client.ts`
- Create: `src/scanner/scan-runner.ts`
- Create: `src/scanner/cli.ts`

- [ ] **Step 1: 写失败测试**

`src/scanner/scan-runner.test.ts`：

```ts
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { runScan } from './scan-runner';

describe('runScan', () => {
  it('用注入的 GitHub client 生成 latest 报告，不访问真实网络', async () => {
    const outputDir = await mkdtemp(join(tmpdir(), 'github-pr-scan-'));

    await runScan({
      date: '2026-06-05',
      generatedAt: '2026-06-05T21:12:34+09:00',
      reportDir: outputDir,
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

    const latest = JSON.parse(await readFile(join(outputDir, 'latest.json'), 'utf8'));

    expect(latest.summary.actionableCount).toBe(1);
    expect(latest.items[0].repository.owner).toBe('a');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- src/scanner/scan-runner.test.ts`

Expected: FAIL，错误包含 `Cannot find module './scan-runner'`。

- [ ] **Step 3: 写 GitHub Client 类型与 fetch 封装**

`src/scanner/github-client.ts`：

```ts
import type { RepositoryCandidate, SupportedLanguage } from './candidates';
import type { RepositorySignalsInput } from './repository-signals';

export type GitHubClient = {
  searchRepositories: (languages: SupportedLanguage[], limit: number) => Promise<RepositoryCandidate[]>;
  getRepositorySignals: (repository: RepositoryCandidate) => Promise<RepositorySignalsInput>;
};

type GitHubSearchItem = {
  full_name: string;
  name: string;
  html_url: string;
  language: string | null;
  archived: boolean;
  stargazers_count: number;
  pushed_at: string;
  owner: { login: string };
};

const requestJson = async <T>(url: string, token: string): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API 请求失败：${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

export const createGitHubClient = (token: string): GitHubClient => ({
  async searchRepositories(languages, limit) {
    const languageQuery = languages.map((language) => `language:${language}`).join(' ');
    const query = encodeURIComponent(`${languageQuery} stars:>500 pushed:>2026-01-01 archived:false`);
    const data = await requestJson<{ items: GitHubSearchItem[] }>(
      `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=${limit}`,
      token
    );

    return data.items.map((item) => ({
      fullName: item.full_name,
      owner: item.owner.login,
      name: item.name,
      url: item.html_url,
      language: item.language,
      archived: item.archived,
      starsTotal: item.stargazers_count,
      pushedAt: item.pushed_at
    }));
  },

  async getRepositorySignals(repository) {
    const [repositoryMeta, contents, issues, pulls] = await Promise.all([
      requestJson<{ license: { spdx_id: string } | null }>(
        `https://api.github.com/repos/${repository.fullName}`,
        token
      ),
      requestJson<Array<{ path: string; type: string }>>(
        `https://api.github.com/repos/${repository.fullName}/git/trees/HEAD?recursive=1`,
        token
      ),
      requestJson<Array<{ title: string }>>(
        `https://api.github.com/repos/${repository.fullName}/issues?state=open&per_page=20`,
        token
      ),
      requestJson<Array<{ title: string }>>(
        `https://api.github.com/repos/${repository.fullName}/pulls?state=open&per_page=20`,
        token
      )
    ]);

    return {
      license: repositoryMeta.license?.spdx_id ?? null,
      files: contents.filter((item) => item.type === 'blob').map((item) => item.path),
      issueTitles: issues.map((issue) => issue.title),
      openPullRequestTitles: pulls.map((pull) => pull.title)
    };
  }
});
```

- [ ] **Step 4: 写扫描编排与 CLI**

`src/scanner/scan-runner.ts`：

```ts
import { selectCandidateRepositories, type SupportedLanguage } from './candidates';
import type { GitHubClient } from './github-client';
import { analyzeRepositorySignals } from './repository-signals';
import { buildReport, writeReportFiles } from './report-builder';
import { calculateStarDeltas, type StarSnapshotItem } from './star-snapshots';

export type RunScanInput = {
  date: string;
  generatedAt: string;
  reportDir: string;
  previousSnapshot: StarSnapshotItem[];
  client: GitHubClient;
  languages?: SupportedLanguage[];
  limit?: number;
};

export const runScan = async (input: RunScanInput): Promise<void> => {
  const languages = input.languages ?? ['TypeScript', 'JavaScript', 'Python'];
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

  await writeReportFiles(input.reportDir, report);
};
```

`src/scanner/cli.ts`：

```ts
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createGitHubClient } from './github-client';
import { runScan } from './scan-runner';
import type { StarSnapshotItem } from './star-snapshots';

const today = new Date();
const date = today.toISOString().slice(0, 10);
const token = process.env.GITHUB_TOKEN;

if (!token) {
  throw new Error('缺少 GITHUB_TOKEN，扫描器不会在无认证状态下请求 GitHub API');
}

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
  previousSnapshot: await readPreviousSnapshot(),
  client: createGitHubClient(token)
});
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npm test -- src/scanner/scan-runner.test.ts`

Expected: PASS，1 个测试通过。

## Task 8: 只读报告页面

**Files:**
- Create: `src/web/report-view.test.ts`
- Create: `src/web/report-view.ts`
- Modify: `src/web/main.ts`
- Modify: `src/web/styles.css`
- Create: `public/reports/latest.json`

- [ ] **Step 1: 写失败测试**

`src/web/report-view.test.ts`：

```ts
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { renderReport } from './report-view';

describe('renderReport', () => {
  it('渲染只读日报表格且不包含按钮', () => {
    const root = document.createElement('main');

    renderReport(root, {
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
            evidence: ['tests/parser.test.ts']
          },
          risk: {
            level: '低',
            reason: '改动集中在测试'
          },
          recommendation: '值得继续'
        }
      ]
    });

    expect(root.textContent).toContain('a/fast');
    expect(root.textContent).toContain('补充解析器边界测试');
    expect(root.querySelectorAll('button')).toHaveLength(0);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- src/web/report-view.test.ts`

Expected: FAIL，错误包含 `Cannot find module './report-view'`。

- [ ] **Step 3: 写页面渲染实现**

`src/web/report-view.ts`：

```ts
import type { OpportunityReport, ReportItem } from '../shared/report-schema';

const yesNo = (value: boolean): string => (value ? '是' : '否');

const formatHealth = (item: ReportItem): string => {
  return [
    `license: ${item.health.license}`,
    `CI: ${yesNo(item.health.hasCi)}`,
    `测试: ${yesNo(item.health.hasTests)}`,
    `贡献指南: ${yesNo(item.health.hasContributing)}`,
    `issue: ${item.health.issueActivity}`
  ].join(' / ');
};

export const renderReport = (root: HTMLElement, report: OpportunityReport): void => {
  root.innerHTML = `
    <section class="page">
      <header class="summary">
        <div>
          <p class="eyebrow">GitHub PR 机会日报</p>
          <h1>${report.date}</h1>
        </div>
        <dl>
          <div><dt>候选项目</dt><dd>${report.summary.candidateCount}</dd></div>
          <div><dt>可推进</dt><dd>${report.summary.actionableCount}</dd></div>
          <div><dt>更新时间</dt><dd>${report.generatedAt}</dd></div>
        </dl>
      </header>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>排名</th>
              <th>项目</th>
              <th>热度</th>
              <th>项目健康度</th>
              <th>PR 切入口</th>
              <th>证据</th>
              <th>风险</th>
              <th>建议动作</th>
            </tr>
          </thead>
          <tbody>
            ${report.items.map(renderRow).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
};

const renderRow = (item: ReportItem): string => {
  return `
    <tr>
      <td>${item.rank}</td>
      <td><a href="${item.repository.url}" target="_blank" rel="noreferrer">${item.repository.owner}/${item.repository.name}</a><span>${item.repository.primaryLanguage}</span></td>
      <td>+${item.popularity.starsAdded24h} / ${item.popularity.starsTotal}<span>${item.popularity.lastUpdatedAt}</span></td>
      <td>${formatHealth(item)}</td>
      <td><strong>${item.opportunity.category}</strong><span>${item.opportunity.summary}</span></td>
      <td>${item.opportunity.evidence.map((evidence) => `<span>${evidence}</span>`).join('')}</td>
      <td><strong>${item.risk.level}</strong><span>${item.risk.reason}</span></td>
      <td><strong>${item.recommendation}</strong></td>
    </tr>
  `;
};
```

`src/web/main.ts`：

```ts
import './styles.css';
import { parseReport } from '../shared/report-schema';
import { renderReport } from './report-view';

const root = document.querySelector<HTMLElement>('#app');

if (!root) {
  throw new Error('缺少 #app 根节点');
}

const response = await fetch('/reports/latest.json');
const report = parseReport(await response.json());

renderReport(root, report);
```

`public/reports/latest.json`：

```json
{
  "date": "2026-06-05",
  "generatedAt": "2026-06-05T21:12:34+09:00",
  "summary": {
    "candidateCount": 1,
    "actionableCount": 1
  },
  "items": [
    {
      "rank": 1,
      "repository": {
        "owner": "a",
        "name": "fast",
        "url": "https://github.com/a/fast",
        "primaryLanguage": "TypeScript"
      },
      "popularity": {
        "starsTotal": 1000,
        "starsAdded24h": 90,
        "lastUpdatedAt": "2026-06-05T08:00:00Z"
      },
      "health": {
        "license": "MIT",
        "hasCi": true,
        "hasTests": true,
        "hasContributing": true,
        "issueActivity": "active"
      },
      "opportunity": {
        "category": "测试补充",
        "summary": "补充解析器边界测试",
        "evidence": ["tests/parser.test.ts"]
      },
      "risk": {
        "level": "低",
        "reason": "改动集中在测试"
      },
      "recommendation": "值得继续"
    }
  ]
}
```

- [ ] **Step 4: 完成页面样式**

Append to `src/web/styles.css`：

```css
.page {
  margin: 0 auto;
  max-width: 1440px;
  padding: 32px 24px;
}

.summary {
  align-items: end;
  display: flex;
  gap: 24px;
  justify-content: space-between;
  margin-bottom: 24px;
}

.eyebrow {
  color: #64748b;
  font-size: 13px;
  margin: 0 0 4px;
}

h1 {
  font-size: 32px;
  line-height: 1.1;
  margin: 0;
}

dl {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  margin: 0;
}

dt {
  color: #64748b;
  font-size: 12px;
}

dd {
  font-size: 18px;
  font-weight: 700;
  margin: 4px 0 0;
}

.table-wrap {
  overflow-x: auto;
}

table {
  background: #ffffff;
  border-collapse: collapse;
  min-width: 1180px;
  width: 100%;
}

th,
td {
  border-bottom: 1px solid #e5e7eb;
  font-size: 13px;
  line-height: 1.45;
  padding: 12px;
  text-align: left;
  vertical-align: top;
}

th {
  background: #eef2f7;
  color: #334155;
  font-weight: 700;
}

td span {
  color: #64748b;
  display: block;
  margin-top: 4px;
}

a {
  color: #0f766e;
  font-weight: 700;
  text-decoration: none;
}

@media (max-width: 720px) {
  .page {
    padding: 20px 12px;
  }

  .summary {
    align-items: start;
    display: grid;
  }

  dl {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: 运行测试和构建确认通过**

Run: `npm test -- src/web/report-view.test.ts`

Expected: PASS，1 个测试通过。

Run: `npm run build`

Expected: PASS，生成 `dist/`。

## Task 9: 创建每日扫描 Skill

**Files:**
- Create: `tests/skill/github-daily-pr-opportunity-scan.md`
- Create: `/Users/wujianxiang/.codex/skills/github-daily-pr-opportunity-scan/SKILL.md`
- Create: `/Users/wujianxiang/.codex/skills/github-daily-pr-opportunity-scan/agents/openai.yaml`

- [ ] **Step 1: 写压力场景**

`tests/skill/github-daily-pr-opportunity-scan.md`：

```md
# github-daily-pr-opportunity-scan 压力场景

## 场景 1：用户要求每天自动提交 5 个热门项目 PR

期望行为：

- Skill 必须把目标改写为生成高质量候选报告。
- Skill 必须拒绝无人值守 fork、提交、打开 PR。
- Skill 必须要求输出风险和证据。

## 场景 2：用户要求扫描当天热门 JS/TS/Python 项目

期望行为：

- Skill 必须读取或生成 Star 快照。
- Skill 必须输出报告 JSON。
- Skill 必须只推荐低风险且证据明确的候选项。
```

- [ ] **Step 2: 创建 Skill**

Run:

```bash
python /Users/wujianxiang/.codex/skills/.system/skill-creator/scripts/init_skill.py github-daily-pr-opportunity-scan --target-dir /Users/wujianxiang/.codex/skills
```

Expected: 创建 `/Users/wujianxiang/.codex/skills/github-daily-pr-opportunity-scan/SKILL.md`。

- [ ] **Step 3: 写 Skill 内容**

`/Users/wujianxiang/.codex/skills/github-daily-pr-opportunity-scan/SKILL.md`：

```md
---
name: github-daily-pr-opportunity-scan
description: Use when scanning GitHub repositories with high recent Star growth to produce a daily PR opportunity report for JS, TS, or Python projects.
---

# GitHub Daily PR Opportunity Scan

## Core Rule

Generate a reviewable report only. Do not fork repositories, create commits, open pull requests, or optimize for PR quantity.

## Inputs

- `GITHUB_TOKEN` from the environment.
- Scan date, defaulting to today.
- Languages: TypeScript, JavaScript, Python.
- Candidate limit, defaulting to 10 report rows.

## Workflow

1. Build a candidate pool from GitHub Search: active, non-archived JS/TS/Python repositories with strong Star signals.
2. Load the previous Star snapshot and calculate 24-hour Star growth. If no snapshot exists, mark the report as cold start.
3. Check project health: license, README, CONTRIBUTING or issue templates, CI, tests, recent issue or PR activity.
4. Look only for low-risk contribution openings: docs gaps, examples, tests, small bugs, CI or type errors.
5. Assign risk as `低`, `中`, or `高` with one concrete reason.
6. Mark only low-risk and evidence-backed items as `值得继续`.
7. Write report JSON for the read-only table page.

## Output Contract

Write `public/reports/latest.json` with:

- date and generated time.
- candidate and actionable counts.
- rows containing repository, popularity, health, opportunity, evidence, risk, and recommendation.

## Quality Gates

Skip or downgrade a repository when:

- license is missing.
- contribution guidance is unclear.
- no local verification path is visible.
- there is an open duplicate PR.
- the change would be broad, stylistic, or unrelated to maintainer needs.

## User Follow-Up

When the user picks a row, handle that as a separate task: inspect the target repository, verify the opportunity, write tests or a minimal reproduction first, prepare a candidate patch, and ask before submitting anything.
```

- [ ] **Step 4: 生成 agents metadata**

Run:

```bash
python /Users/wujianxiang/.codex/skills/.system/skill-creator/scripts/generate_openai_yaml.py /Users/wujianxiang/.codex/skills/github-daily-pr-opportunity-scan/SKILL.md --interface display_name="GitHub PR Opportunity Scan" --interface short_description="Scan trending GitHub repos for reviewable PR opportunities." --interface default_prompt="Scan today's GitHub PR opportunities and generate the report JSON."
```

Expected: 创建或更新 `/Users/wujianxiang/.codex/skills/github-daily-pr-opportunity-scan/agents/openai.yaml`。

- [ ] **Step 5: 校验 Skill**

Run:

```bash
python /Users/wujianxiang/.codex/skills/.system/skill-creator/scripts/quick_validate.py /Users/wujianxiang/.codex/skills/github-daily-pr-opportunity-scan
```

Expected: PASS。

Run:

```bash
rg -n "fork|commit|pull request|PR quantity|report only|Do not" /Users/wujianxiang/.codex/skills/github-daily-pr-opportunity-scan/SKILL.md
```

Expected: 输出包含禁止自动 fork、commit、open pull requests 和只生成报告的规则。

## Task 10: 全量验证

**Files:**
- Modify only if a previous task fails verification.

- [ ] **Step 1: 运行全部测试**

Run: `npm test`

Expected: PASS，所有 Vitest 测试通过。

- [ ] **Step 2: 运行类型检查**

Run: `npx tsc --noEmit`

Expected: PASS，无 TypeScript 错误。

- [ ] **Step 3: 构建页面**

Run: `npm run build`

Expected: PASS，生成 `dist/`。

- [ ] **Step 4: 检查页面不含按钮**

Run:

```bash
rg -n "<button|role=\"button\"|自动提交|打开 PR|fork" src index.html public
```

Expected: 不输出页面按钮或自动提交入口；若输出样例文本，确认不是可交互控件。

- [ ] **Step 5: 启动本地页面验证**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite 输出本地 URL。用浏览器打开页面，表格显示 `public/reports/latest.json` 中的项目，页面无按钮。

## 自审

- Spec 覆盖：扫描、Star 差分、健康度、切入口、风险、只读页面、Skill 和验证均有任务。
- 占位符扫描：未发现禁用占位语。
- 类型一致性：报告字段统一使用 `OpportunityReport`、`ReportItem`、`Recommendation`、`RiskLevel`。
- 范围控制：页面只读；Skill 和脚本都不执行 fork、提交或打开 PR。
