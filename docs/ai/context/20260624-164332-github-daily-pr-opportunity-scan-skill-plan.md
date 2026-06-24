# GitHub Daily PR Opportunity Scan Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 `github-daily-pr-opportunity-scan` 既能在任意目录筛出值得后续提交低风险 PR 的 GitHub 项目，又能在当前仓内复用扫描器刷新 `public/reports/latest.json`。

**Architecture:** 把“搜索模板 + 候选过滤 + 本地可验证性/重型项目门槛”落到当前仓扫描器里，保证看板刷新结果和 Skill 规则一致；再把同一套边界沉淀到本机个人 Skill `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan`，附带参考文档和一个通用候选发现脚本。Skill 在本仓内优先调用现有扫描器，在其他目录输出候选列表但不强依赖本仓代码。

**Tech Stack:** TypeScript, Vitest, Node fetch, Python 3, Codex local skills (`SKILL.md`, `agents/openai.yaml`)

---

## File Map

- Create: `src/scanner/search-templates.ts`
- Create: `src/scanner/search-templates.test.ts`
- Modify: `src/scanner/github-client.ts`
- Modify: `src/scanner/candidates.ts`
- Modify: `src/scanner/candidates.test.ts`
- Modify: `src/scanner/repository-signals.ts`
- Modify: `src/scanner/repository-signals.test.ts`
- Modify: `tests/skill/github-daily-pr-opportunity-scan.md`
- Create: `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\SKILL.md`
- Create: `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\agents\openai.yaml`
- Create: `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\references\search-queries.md`
- Create: `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\references\scoring-rubric.md`
- Create: `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\scripts\find_candidates.py`

## Task 1: 把默认搜索入口从“泛热度”改成“可贡献候选池”

**Files:**
- Create: `src/scanner/search-templates.test.ts`
- Create: `src/scanner/search-templates.ts`
- Modify: `src/scanner/github-client.ts`
- Modify: `src/scanner/candidates.ts`
- Modify: `src/scanner/candidates.test.ts`

- [ ] **Step 1: 先写搜索模板失败测试**

```ts
import { describe, expect, it } from 'vitest';
import { buildSearchQueries } from './search-templates';

describe('buildSearchQueries', () => {
  it('默认生成面向 agent、mcp、cli、developer-tools 的全网查询', () => {
    const queries = buildSearchQueries({
      pushedAfter: '2026-01-01',
      languages: []
    });

    expect(queries).toEqual([
      'topic:agent archived:false stars:>50 pushed:>=2026-01-01',
      'topic:mcp archived:false stars:>50 pushed:>=2026-01-01',
      'topic:cli archived:false stars:>50 pushed:>=2026-01-01',
      'topic:developer-tools archived:false stars:>50 pushed:>=2026-01-01',
      '"model context protocol" archived:false stars:>50 pushed:>=2026-01-01'
    ]);
  });

  it('传入语言白名单时为每条查询附加 language 限制', () => {
    const queries = buildSearchQueries({
      pushedAfter: '2026-01-01',
      languages: ['TypeScript']
    });

    expect(queries).toContain(
      'topic:agent language:TypeScript archived:false stars:>50 pushed:>=2026-01-01'
    );
  });
});
```

- [ ] **Step 2: 运行测试确认它先红**

Run: `npm test -- src/scanner/search-templates.test.ts`

Expected: FAIL，报 `Cannot find module './search-templates'`。

- [ ] **Step 3: 实现搜索模板生成器**

```ts
export type SearchTemplateInput = {
  pushedAfter: string;
  languages: string[];
};

const defaultTopics = ['agent', 'mcp', 'cli', 'developer-tools'];
const defaultFreeTextQueries = ['"model context protocol"'];

const withLanguage = (query: string, language: string | null): string => {
  return language ? `${query} language:${language}` : query;
};

export const buildSearchQueries = (input: SearchTemplateInput): string[] => {
  const baseQueries = [
    ...defaultTopics.map((topic) => `topic:${topic}`),
    ...defaultFreeTextQueries
  ];
  const languages = input.languages.length > 0 ? input.languages : [null];

  return languages.flatMap((language) =>
    baseQueries.map((baseQuery) =>
      `${withLanguage(baseQuery, language)} archived:false stars:>50 pushed:>=${input.pushedAfter}`
    )
  );
};
```

- [ ] **Step 4: 给候选过滤补“近期活跃”门槛测试**

在 `src/scanner/candidates.test.ts` 追加：

```ts
it('过滤长期不活跃仓库，即使总 Star 很高也不保留', () => {
  const result = selectCandidateRepositories(
    [
      {
        fullName: 'a/active',
        owner: 'a',
        name: 'active',
        url: 'https://github.com/a/active',
        language: 'TypeScript',
        archived: false,
        starsTotal: 300,
        pushedAt: '2026-06-10T10:00:00Z'
      },
      {
        fullName: 'b/stale',
        owner: 'b',
        name: 'stale',
        url: 'https://github.com/b/stale',
        language: 'TypeScript',
        archived: false,
        starsTotal: 8000,
        pushedAt: '2025-01-01T10:00:00Z'
      }
    ],
    {
      languages: ['TypeScript'],
      pushedAfter: '2026-01-01'
    }
  );

  expect(result.map((item) => item.fullName)).toEqual(['a/active']);
});
```

- [ ] **Step 5: 运行候选过滤测试确认它先红**

Run: `npm test -- src/scanner/candidates.test.ts`

Expected: FAIL，报 `selectCandidateRepositories` 参数签名不匹配，或缺少 `pushedAfter` 过滤逻辑。

- [ ] **Step 6: 最小改造候选过滤与 GitHub client**

`src/scanner/candidates.ts` 改成：

```ts
export type CandidateSelectionInput = {
  languages: SupportedLanguage[];
  pushedAfter: string;
};

export const selectCandidateRepositories = (
  repositories: RepositoryCandidate[],
  input: CandidateSelectionInput
): RepositoryCandidate[] => {
  const allowed = new Set<string>(input.languages);
  const pushedAfter = Date.parse(input.pushedAfter);

  return repositories
    .filter((repository) => !repository.archived)
    .filter((repository) => repository.language !== null)
    .filter((repository) => allowed.size === 0 || allowed.has(repository.language ?? ''))
    .filter((repository) => Date.parse(repository.pushedAt) >= pushedAfter)
    .sort((left, right) => right.starsTotal - left.starsTotal);
};
```

`src/scanner/github-client.ts` 接入模板：

```ts
import { buildSearchQueries } from './search-templates';

const pushedAfter = new Date();
pushedAfter.setDate(pushedAfter.getDate() - 180);
const pushedAfterText = pushedAfter.toISOString().slice(0, 10);
const searchQueries = buildSearchQueries({
  pushedAfter: pushedAfterText,
  languages
});
```

- [ ] **Step 7: 绿灯验证这一批搜索入口改动**

Run: `npm test -- src/scanner/search-templates.test.ts src/scanner/candidates.test.ts`

Expected: PASS。

- [ ] **Step 8: 提交这一批 repo 搜索入口改动**

```bash
git add src/scanner/search-templates.ts src/scanner/search-templates.test.ts src/scanner/github-client.ts src/scanner/candidates.ts src/scanner/candidates.test.ts
git commit -m "feat: narrow scanner queries to actionable repos"
```

## Task 2: 把“本地可验证”变成风险判断硬门槛

**Files:**
- Modify: `src/scanner/repository-signals.test.ts`
- Modify: `src/scanner/repository-signals.ts`

- [ ] **Step 1: 先写重型项目默认跳过的失败测试**

在 `src/scanner/repository-signals.test.ts` 追加：

```ts
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
```

- [ ] **Step 2: 再写“大项目文档类例外”失败测试**

同文件继续追加：

```ts
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
```

- [ ] **Step 3: 运行测试确认它先红**

Run: `npm test -- src/scanner/repository-signals.test.ts`

Expected: FAIL，现有 `analyzeRepositorySignals()` 仍会把这两类仓库评成 `谨慎` 或 `值得继续`。

- [ ] **Step 4: 实现重型项目识别和文档例外规则**

`src/scanner/repository-signals.ts` 增加最小 helper：

```ts
const hasHeavyInfrastructureMarkers = (files: string[]): boolean => {
  return includesAny(files, [
    /^terraform\//i,
    /^helm\//i,
    /^charts\//i,
    /^k8s\//i,
    /^docker-compose/i,
    /^\.github\/workflows\/deploy/i
  ]);
};

const hasLowRiskDocsCue = (files: string[], issueTitles: string[]): boolean => {
  return includesAny(files, [/^README/i, /^docs\//i]) &&
    includesAny(issueTitles, [/readme/i, /doc/i, /link/i, /example/i, /install/i, /usage/i]);
};
```

把主流程改成：

```ts
const heavyInfrastructure = hasHeavyInfrastructureMarkers(input.files);
const lowRiskDocsCue = hasLowRiskDocsCue(input.files, input.issueTitles);

if (duplicate) {
  // 保持已有重复 PR 直接跳过
}

if (heavyInfrastructure && !lowRiskDocsCue) {
  return {
    health,
    opportunity: {
      category: '小 bug',
      summary: '仓库验证依赖重型环境，不适合作为默认低风险候选',
      evidence: input.files.filter((file) => /terraform|helm|deploy|k8s|docker/i.test(file)).slice(0, 3)
    },
    risk: {
      level: '高',
      reason: '需要重型基础设施或专有环境才能验证'
    },
    recommendation: '跳过'
  };
}

if (heavyInfrastructure && lowRiskDocsCue) {
  return {
    health,
    opportunity: {
      category: '文档缺口',
      summary: '仓库本体较重，只保留文档或坏链这类低风险切口',
      evidence: [
        ...input.files.filter((file) => /README|docs/i.test(file)).slice(0, 2),
        ...input.issueTitles.slice(0, 1)
      ]
    },
    risk: {
      level: '中',
      reason: '主项目验证成本高，仅建议低风险文档类改动'
    },
    recommendation: '谨慎'
  };
}
```

- [ ] **Step 5: 绿灯验证风险规则**

Run: `npm test -- src/scanner/repository-signals.test.ts`

Expected: PASS。

- [ ] **Step 6: 提交这一批风险门槛改动**

```bash
git add src/scanner/repository-signals.ts src/scanner/repository-signals.test.ts
git commit -m "feat: penalize repos that are hard to verify locally"
```

## Task 3: 更新 Skill 压力场景并安装本机 Skill 骨架

**Files:**
- Modify: `tests/skill/github-daily-pr-opportunity-scan.md`
- Create: `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\SKILL.md`
- Create: `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\agents\openai.yaml`
- Create: `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\references\search-queries.md`
- Create: `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\references\scoring-rubric.md`
- Create: `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\scripts\find_candidates.py`

- [ ] **Step 1: 先把 repo 内 Skill 场景改成当前目标**

把 `tests/skill/github-daily-pr-opportunity-scan.md` 改成至少覆盖这 5 类压力：

```md
# github-daily-pr-opportunity-scan 压力场景

## 场景 1：用户要求每天自动提交 5 个热门项目 PR
- 期望：拒绝无人值守 fork / 提交 / 开 PR，只输出候选和风险。

## 场景 2：用户要求找最近值得提低风险 PR 的 GitHub 项目
- 期望：优先按可贡献性筛选，不把热度当成唯一标准。

## 场景 3：候选项目需要云资源、企业账号或集群
- 期望：默认跳过。

## 场景 4：大项目只有 README 坏链或配置说明问题
- 期望：允许保留，但最多标为谨慎或低风险文档切口。

## 场景 5：当前目录就是日报仓
- 期望：除对话候选外，还刷新 public/reports/latest.json。
```

- [ ] **Step 2: 运行初始化脚本创建本机 Skill 骨架**

Run:

```powershell
python C:\Users\yui\.codex\skills\.system\skill-creator\scripts\init_skill.py github-daily-pr-opportunity-scan --path C:\Users\yui\.codex\skills --resources scripts,references --interface display_name="GitHub PR Opportunity Scan" --interface short_description="Find GitHub repos worth low-risk follow-up PR work." --interface default_prompt="Find good GitHub projects for low-risk follow-up PRs, and refresh the dashboard report when this repo is open."
```

Expected: 创建 `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\`。

- [ ] **Step 3: 写 Skill frontmatter 和主流程**

`C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\SKILL.md` 头部直接写成：

```md
---
name: github-daily-pr-opportunity-scan
description: Use when Codex needs to find GitHub repositories worth low-risk follow-up PR work, rank candidates by contribution feasibility instead of raw hype, or refresh the github-daily-pr-opportunity dashboard report when working in this repo.
---
```

正文至少包含：

- 目标：找值得继续推进的低风险 PR 候选。
- 两种模式：通用发现模式、本仓看板刷新模式。
- 硬门槛：`archived`、长期不活跃、重型云/集群/专有环境、明显无法本地验证。
- 唯一例外：文档、示例、坏链、配置说明。
- 禁止项：不自动 fork、不自动提交、不自动开 PR、不为凑数量放宽门槛。

- [ ] **Step 4: 补 Skill references**

`references/search-queries.md` 至少写：

```md
# Search Queries

- 默认主查询：`topic:agent`, `topic:mcp`, `topic:cli`, `topic:developer-tools`, `"model context protocol"`
- 强制附加：`archived:false`, `stars:>50`，以及按“今天往前 180 天”计算出来的 `pushed:>=2026-01-01` 这类近期活跃过滤
- 去重检查：同名仓合并、issue/PR 重复方向排除、main 已修复排除
- 本仓检测：`src/scanner/cli.ts`, `src/scanner/scan-runner.ts`, `public/reports/latest.json`
```

`references/scoring-rubric.md` 至少写：

```md
# Scoring Rubric

## 值得继续
- 切口明确
- 风险低
- 本地验证路径清楚

## 谨慎
- 方向可能成立
- 但验证成本高、门禁重或需要人工复核

## 跳过
- 重型环境依赖
- 明显重复
- 长期不活跃
- 收益低于投入
```

- [ ] **Step 5: 写通用候选发现脚本**

`scripts/find_candidates.py` 先做最小可用版本：

```py
#!/usr/bin/env python3
import argparse
import json
import os
import urllib.parse
import urllib.request

DEFAULT_QUERIES = [
    'topic:agent archived:false stars:>50',
    'topic:mcp archived:false stars:>50',
    'topic:cli archived:false stars:>50',
    'topic:developer-tools archived:false stars:>50',
    '"model context protocol" archived:false stars:>50',
]

def request_json(url: str, token: str):
    request = urllib.request.Request(url, headers={
        'Accept': 'application/vnd.github+json',
        'Authorization': f'Bearer {token}',
        'X-GitHub-Api-Version': '2022-11-28',
    })
    with urllib.request.urlopen(request) as response:
        return json.load(response)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--limit', type=int, default=10)
    parser.add_argument('--format', choices=['json', 'markdown'], default='markdown')
    args = parser.parse_args()

    token = os.environ.get('GITHUB_TOKEN')
    if not token:
        raise SystemExit('缺少 GITHUB_TOKEN')

    seen = {}
    for raw_query in DEFAULT_QUERIES:
      query = urllib.parse.quote(raw_query)
      data = request_json(
          f'https://api.github.com/search/repositories?q={query}&sort=stars&order=desc&per_page={args.limit}',
          token,
      )
      for item in data.get('items', []):
          seen[item['full_name']] = {
              'full_name': item['full_name'],
              'url': item['html_url'],
              'language': item['language'],
              'stars': item['stargazers_count'],
              'pushed_at': item['pushed_at'],
          }

    rows = list(seen.values())[:args.limit]
    if args.format == 'json':
        print(json.dumps(rows, ensure_ascii=False, indent=2))
        return

    for index, row in enumerate(rows, start=1):
        print(f"{index}. {row['full_name']} | {row['language']} | stars={row['stars']} | pushed={row['pushed_at']}")

if __name__ == '__main__':
    main()
```

- [ ] **Step 6: repo 内记录这次 Skill 压力场景改动**

```bash
git add tests/skill/github-daily-pr-opportunity-scan.md
git commit -m "test: refresh github project discovery skill scenarios"
```

## Task 4: 把 Skill 文案和 repo 集成边界写实，不留口子

**Files:**
- Modify: `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\SKILL.md`
- Modify: `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\references\search-queries.md`
- Modify: `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\references\scoring-rubric.md`

- [ ] **Step 1: 在 SKILL.md 写清“通用输出”和“本仓刷新”双模式**

关键正文直接包含：

```md
1. 在任意目录先输出 5 到 10 个候选。
2. 每个候选必须给出：建议切口、关键证据、主要风险、本地验证可行性说明。
3. 如果当前目录存在 `src/scanner/cli.ts`、`src/scanner/scan-runner.ts`、`public/reports/latest.json`，优先运行当前仓扫描链路刷新报告。
4. 如果不在该仓，停止在对话输出，不要尝试伪造 dashboard 文件。
```

- [ ] **Step 2: 在 SKILL.md 写清禁止项和红旗**

```md
## Red Flags

- 只因为 Star 高就推荐
- 忽略本地无法验证
- 已有 open PR 仍继续推荐同方向
- 为了凑数量放宽标准
- 未经用户点名就进入 fork / 提交 / 开 PR

以上任一出现时，重新筛候选，不要继续输出。
```

- [ ] **Step 3: 在 references 里把查询模板和评分规则写成可扫描格式**

要求：

- 每条查询单独一行。
- 每个等级的判定条件使用短 bullet。
- 明确“重型基础设施无低风险文档切口 -> 跳过”。
- 明确“坏链 / README / 配置说明类例外 -> 最多谨慎或文档缺口”。

- [ ] **Step 4: 本机 Skill 元数据最终回读**

Run:

```powershell
Get-Content -Raw C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\SKILL.md
Get-Content -Raw C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\agents\openai.yaml
```

Expected: frontmatter、触发描述、UI metadata 一致，不残留模板占位文字。

## Task 5: 验证 repo 扫描器和本机 Skill

**Files:**
- Modify: `public/reports/latest.json`（仅当真实跑 scan）
- Modify: `dist/reports/latest.json`（仅当构建或同步静态产物）

- [ ] **Step 1: 先跑 repo 侧 focused tests**

Run:

```bash
npm test -- src/scanner/search-templates.test.ts src/scanner/candidates.test.ts src/scanner/repository-signals.test.ts
```

Expected: PASS。

- [ ] **Step 2: 再跑现有相关回归**

Run:

```bash
npm test -- src/scanner/scan-runner.test.ts src/scanner/report-builder.test.ts src/shared/report-schema.test.ts src/web/report-view.test.ts
```

Expected: PASS，确保 schema 和看板未被破坏。

- [ ] **Step 3: 校验 Skill 结构**

Run:

```powershell
python C:\Users\yui\.codex\skills\.system\skill-creator\scripts\quick_validate.py C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan
```

Expected: 输出 `Skill is valid!`。

- [ ] **Step 4: 跑 Skill 自带脚本做一次真实候选发现**

Run:

```powershell
python C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\scripts\find_candidates.py --limit 5 --format json
```

Expected: 输出 5 条去重后的候选 JSON；如果缺少 `GITHUB_TOKEN`，应明确报错，而不是静默成功。

- [ ] **Step 5: 在本仓内真实刷新一次看板**

Run:

```bash
npm run scan
npx tsx -e "import { readFileSync } from 'node:fs'; import { parseReport } from './src/shared/report-schema.ts'; const report = parseReport(JSON.parse(readFileSync('public/reports/latest.json', 'utf8'))); console.log(report.items.length)"
```

Expected: `npm run scan` 成功写入报告；`parseReport` 输出一个大于 0 的候选数。

- [ ] **Step 6: 记录最终结果并给用户汇报**

Run:

```powershell
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$path = "docs/ai/context/$timestamp-github-daily-pr-opportunity-scan-implementation-record.md"
New-Item -ItemType File -Path $path
```

Expected: 生成一份新的 implementation record 文件，而不是覆写旧记录。

内容至少记录：

- Skill 安装路径
- repo 改动文件
- 通过的测试命令
- 真实扫描是否成功
- 是否需要重启 Codex 才能识别新 Skill
