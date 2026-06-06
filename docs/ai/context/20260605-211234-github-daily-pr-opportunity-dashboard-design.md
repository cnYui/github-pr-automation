# GitHub 每日热门项目 PR 机会展示页设计

## 目标

每天发现 GitHub 上最近 24 小时新增 Star 较高的热门项目，分析其中 JS/TS 与 Python 仓库的低风险贡献切入口，并生成一个只读单页表格，帮助用户决定哪个项目值得继续推进。

首版不自动 fork、不自动提交、不自动打开 PR。用户阅读报告页后，在对话中点名某个项目，再进入单独的代码分析与候选 PR 准备流程。

## 非目标

- 不做无人值守批量提交 PR。
- 不把每日目标解释为机械提交数量。
- 不做复杂 Web 后台、审批流或操作按钮。
- 不覆盖 JS/TS 与 Python 之外的语言。
- 不推荐纯格式化、批量拼写、无明确价值的大改。

## 推荐方案

采用半自动工作台的简化首版：

- 一个每日扫描 Skill：`github-daily-pr-opportunity-scan`。
- 一个扫描脚本：调用 GitHub API，保存快照，生成报告 JSON。
- 一个单页报告：读取 JSON，渲染只读表格。
- 一个后续推进流程：用户在对话中指定项目后，再单独处理。

选择原因：

- 比纯 CLI 报告更适合横向比较项目。
- 比完整 Web 后台更轻，首版成本低。
- 页面只展示数据，不接触 GitHub Token，不触发提交动作。

## 排行与候选口径

主指标是最近 24 小时新增 Star 数。实现上不假设 GitHub 有现成的新增 Star 排行 API，而是保存每日 Star 快照，用今天与昨天的差值计算。

首次运行没有昨天快照时，用 GitHub Search 的近期高 star、近期活跃、非 archived 仓库作为冷启动候选池。后续运行用快照差分排序，必要时用 stargazers 的 `starred_at` 做候选校验。

辅助过滤：

- 总 Star 不过低。
- 有明确 license。
- 最近有维护活动。
- 有 README、贡献指南、issue 模板或清晰维护信号。
- 主语言属于 TypeScript、JavaScript 或 Python。

## 单页报告结构

页面顶部显示：

- 当天日期。
- 候选项目数量。
- 可推进项目数量。
- 数据更新时间。

表格字段：

| 字段 | 用途 |
| --- | --- |
| 排名 | 按最近 24 小时新增 Star 排序 |
| 项目 | `owner/repo`、链接、主语言 |
| 热度 | 24 小时新增 Star、总 Star、最近更新时间 |
| 项目健康度 | license、CI、测试、贡献指南、issue 活跃度 |
| PR 切入口 | 建议从文档、示例、测试、小 bug、类型/CI 哪个角度切 |
| 证据 | 触发建议的 README、issue、CI、测试缺口等依据 |
| 风险 | 维护者不接受概率、改动范围、验证难度、已有重复 PR |
| 建议动作 | `值得继续`、`谨慎`、`跳过`，只显示文字 |

页面不放按钮，不提供 fork、提交、PR 创建或审批操作。

## 数据流

每日任务分 5 步：

1. 拉取候选池：用 GitHub Search 找近期高 star、近期活跃、非 archived 的 JS/TS/Python 仓库。
2. 计算热度：保存每日 star 快照，用今天和昨天的差值计算 24 小时新增 Star；首次运行没有昨天数据时，用 Search 结果做冷启动。
3. 筛选健康度：检查 license、默认分支更新时间、README、CONTRIBUTING、issue 活跃度、CI/test 配置。
4. 分析 PR 切入口：只找文档缺口、示例缺口、测试补充、小 bug、类型/CI 问题。
5. 生成报告数据：产出 JSON 文件，页面只读取 JSON 并渲染表格。

## JSON 数据结构

报告 JSON 建议结构：

```json
{
  "date": "2026-06-05",
  "generatedAt": "2026-06-05T21:12:34+09:00",
  "summary": {
    "candidateCount": 10,
    "actionableCount": 5
  },
  "items": [
    {
      "rank": 1,
      "repository": {
        "owner": "owner",
        "name": "repo",
        "url": "https://github.com/owner/repo",
        "primaryLanguage": "TypeScript"
      },
      "popularity": {
        "starsTotal": 12000,
        "starsAdded24h": 430,
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
        "summary": "核心解析器缺少边界输入测试",
        "evidence": ["tests/parser 目录存在", "近期 issue 提到边界输入异常"]
      },
      "risk": {
        "level": "低",
        "reason": "改动集中在测试文件，已有测试框架可验证"
      },
      "recommendation": "值得继续"
    }
  ]
}
```

## 质量门槛

每个候选项目必须评估：

| 维度 | 判断 |
| --- | --- |
| 热度 | 24 小时新增 Star 足够高，且不是一次性噪声 |
| 维护活跃 | 最近有 commit、issue 或 PR 活动 |
| 贡献友好 | 有 license、README、贡献指南或清晰 issue 模板 |
| 可验证 | 本地能安装，能跑测试、lint、typecheck 中至少一种 |
| 切入口明确 | 能指出具体文件、issue、文档缺口或失败证据 |
| 风险可控 | 改动小、价值明确、没有重复 PR、不会大规模重构 |

默认只有低风险且切入口明确的项目才标为 `值得继续`。中风险标为 `谨慎`。高风险标为 `跳过`。

## 贡献切入口范围

允许：

- 文档缺口修复。
- 示例补全。
- 测试补充。
- 小 bug 修复。
- CI、类型错误或静态检查错误修复。

排除：

- 纯格式化 PR。
- 批量拼写修正。
- 无 issue 背景或无维护者信号的大规模重构。
- 与项目方向无关的蹭热度变更。

## Skill 设计

Skill 名称：`github-daily-pr-opportunity-scan`

触发场景：需要扫描当天 GitHub 新增 Star 热门项目，并生成 PR 机会报告时使用。

输入：

- GitHub Token。
- 扫描日期。
- 语言范围：JS/TS/Python。
- 候选数量。

输出：

- 报告 JSON。
- 可选扫描日志。

Skill 必须强调：

- 只生成报告，不提交 PR。
- 不自动 fork。
- 不自动打开 PR。
- 不为凑数量推荐低质量贡献。

## 错误处理

- GitHub API 限流：记录限流状态，保留已有快照，不生成伪造数据。
- 首次运行无快照：明确标记为冷启动结果。
- 仓库缺少 license 或贡献规范：降低推荐级别或跳过。
- 无法判断测试方式：风险升为中或高。
- 已有重复 PR：跳过或标记高风险。

## 测试与验证

实现阶段按 TDD 进行：

| 对象 | 验证方式 |
| --- | --- |
| 扫描脚本 | 用 fixture 模拟 GitHub API 响应，测试筛选、排序、风险评级、JSON 输出 |
| Star 差分 | 用两天快照测试新增 Star 排序、首次运行冷启动 |
| 仓库分析 | 用 JS/TS、Python、小样例仓库测试语言识别、CI/test 检测 |
| 报告页面 | 用固定 JSON 测试表格渲染，确认无按钮、字段完整、移动端不乱 |
| Skill | 用场景测试确认它会生成报告，不会指导自动提交 PR |

## 后续推进流程

用户阅读报告页后，在对话中指定某个项目。之后单独执行：

1. clone 或 fork 目标仓库。
2. 阅读贡献指南和相关 issue。
3. 确认切入口仍然成立。
4. 先写测试或最小复现。
5. 实现补丁。
6. 跑项目验证。
7. 生成 PR 草稿和风险说明。
8. 用户确认后再提交。

## 自审结论

- 没有保留待定项。
- 页面、扫描脚本、Skill 与后续推进流程职责清晰。
- 所有自动化边界都排除了无人值守提交 PR。
- 设计范围足够小，可以进入实现计划阶段。

## 当前限制

当前目录不是 Git 仓库，因此无法提交设计文档。设计文档已按用户要求保存到 `docs/ai/context/`。
