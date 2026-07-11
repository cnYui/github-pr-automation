# GitHub 项目发现扫描记录

## 请求

用户要求使用 `github-daily-pr-opportunity-scan` Skill 开始寻找值得后续提交低风险 PR 的 GitHub 项目。

## 采用方式

- 当前目录命中 dashboard 模式检测条件：
  - `src/scanner/cli.ts`
  - `src/scanner/scan-runner.ts`
  - `public/reports/latest.json`
- 先读取 Skill、查询模板、评分规则，以及今日已有的 design / plan 文档。
- 使用当前仓已有扫描器刷新报告，不新造输出格式。

## 实际执行

- 运行前发现当前 shell 没有 `GITHUB_TOKEN`。
- 本机 `gh auth status` 已确认 `cnYui` 账号登录有效。
- 用临时环境变量注入 token 后执行：

```powershell
$env:GITHUB_TOKEN = gh auth token
npm run scan
```

- 扫描完成时间对应报告时间：`2026-06-24T08:25:33.767Z`

## 本轮刷新结果

- 已刷新：
  - `public/reports/latest.json`
  - `public/reports/2026-06-24.json`
  - `data/snapshots/latest.json`
  - `data/snapshots/2026-06-24.json`
- 本轮报告摘要：
  - `candidateCount = 10`
  - `actionableCount = 2`

## 二次人工筛选

### 值得继续

#### `n8n-io/n8n`

- 扫描器结论：`值得继续`
- 现场核对：
  - open issue `#32854`：`Docs: MCP "document_processing" best-practices states Extract from File output key is "text"; default is "data"`
  - 最近 open PR 前 10 条未看到同方向 docs 修复
  - 仓库活跃，默认分支 `master`，最近 push 为 `2026-06-24T08:27:42Z`
- 建议切口：
  - 修正文档里 MCP `document_processing` 的输出 key 说明
- 主要风险：
  - 仓库体量大，但这是纯文档切口，风险可控
- 本地验证：
  - grep 文档与示例引用
  - 如仓内有 docs 校验命令则跑目标命令；没有则至少做全文搜索和 diff check

#### `Snailclimb/JavaGuide`

- 扫描器结论：`值得继续`
- 人工复核后降为：`谨慎`
- 现场核对：
  - open issue `#2649`：`关于数组转集合方法的第六种：使用Java9的List.of()`
  - open issue `#2433`：`ArrayList源码分析中对toArray()的描述...不准确`
  - open PR 仅见 `#2878`、`#2877`、`#2876`，未直接覆盖上述两条内容勘误
  - 仓库最近 push 为 `2026-06-17T07:06:40Z`
- 建议切口：
  - 选择单条内容勘误做最小文档修正，不碰英文全量翻译或目录 UI 需求
- 主要风险：
  - 仓库没有显式 `CONTRIBUTING` 信号，issue 里混有讨论帖和长期未收口内容
- 本地验证：
  - 只需针对目标文档段落做事实核对、全文搜索和 diff check

### 跳过

#### `farion1231/cc-switch`

- 原因：
  - 扫描器已发现相近 open PR 信号
  - 证据：`feat: support Kimi Code providers`、`feat(usage): support multi-request usage script config`
- 结论：
  - 当前不适合继续追

#### `affaan-m/ECC`

- 原因：
  - 扫描器已发现相近 open PR 信号
  - 证据：`refactor(commands): remove duplicated content in skill-create and learn-eval`、`feat(skills): make tdd-workflow test-runner aware (npm/pnpm/yarn/bun)`
- 结论：
  - 当前不适合继续追

#### `google-gemini/gemini-cli`

- 原因：
  - 扫描器已发现相近 open PR 信号
  - 证据：`Feat/tool registry discovery`、`fix(mcp): add SSRF protection to OAuth metadata discovery`
- 结论：
  - 当前不适合继续追

#### `puppeteer/puppeteer`

- 原因：
  - 扫描器已发现相近 open PR 信号
  - 证据：`chore: release main`、`fix: provide correct creation time for screen recordings`
- 结论：
  - 当前不适合默认投入

## 当前判断

- 本轮真正优先推进的只有一个强候选：`n8n-io/n8n`
- `Snailclimb/JavaGuide` 可作为文档勘误备选，但应降级为 `谨慎`
- 其余高 Star 仓库当前更像热度入口，不像低风险 PR 入口

## 后续建议

- 如果用户要我继续推进，我建议先做 `n8n-io/n8n#32854`
- 如果要继续扩池，应缩小搜索范围，避免继续被超大仓和高重复 PR 噪声主导：
  - 进一步偏向 `agent` / `mcp` / `cli` 中等体量仓库
  - 提前加入 issue / PR 去重和 issue-first 门禁筛选
